import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import NativeShimmerOverlay, { PageType } from "@/components/NativeShimmerOverlay";
import OAuthModal from "@/components/OAuthModal";
import OfflineScreen from "@/components/OfflineScreen";
import SplashOverlay from "@/components/SplashOverlay";
import { useBackHandler } from "@/hooks/useBackHandler";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import {
  INJECTED_JS as DOOGO_INJECTED_JS,
  INJECTED_JS_BEFORE as DOOGO_INJECTED_JS_BEFORE,
  RUNTIME_JS as DOOGO_RUNTIME_JS,
  sectionShimmerJS,
} from "@/utils/webviewInjection";

const DOOGO_URL = "https://doogo.shop";
const TRUSTED_DOMAINS = ["doogo.shop", "www.doogo.shop"];

// Pages we precache — served from the in-memory HTML cache.
const PRECACHE_PATHS = [
  "https://doogo.shop/",
  "https://doogo.shop/shop",
  "https://doogo.shop/my-account/?et-wishlist-page",
  "https://doogo.shop/my-account",
];

const GOOGLE_AUTH_DOMAINS = [
  "accounts.google.com",
  "accounts.youtube.com",
  "oauth2.googleapis.com",
  "apis.google.com",
];

function isGoogleAuthUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    return GOOGLE_AUTH_DOMAINS.some((d) => url.hostname.endsWith(d));
  } catch {
    return false;
  }
}

/** Map a navigation URL to one of our PageType tokens. */
function pageTypeFor(urlStr: string): PageType {
  try {
    const { pathname, search } = new URL(urlStr);
    if (!pathname || pathname === "/" || pathname === "") return "home";
    if (pathname.startsWith("/shop") || pathname.startsWith("/product-category/"))
      return "shop";
    if (pathname.startsWith("/my-account")) {
      if (search.includes("et-wishlist-page")) return "wishlist";
      return "account";
    }
    if (pathname.startsWith("/product/")) return "product";
    if (pathname.startsWith("/checkout"))  return "checkout";
    return "default";
  } catch {
    return "default";
  }
}

/**
 * Normalize a navigation URL to a cache key.
 * Keeps the search string so that /my-account and /my-account/?et-wishlist-page
 * are stored and served as separate cache entries. Hash is always stripped.
 */
function cacheKeyFor(rawUrl: string): string | null {
  try {
    const u = new URL(rawUrl);
    if (
      !TRUSTED_DOMAINS.some(
        (d) => u.hostname.replace(/^www\./, "") === d.replace(/^www\./, "")
      )
    )
      return null;
    const path =
      u.pathname.length > 1 ? u.pathname.replace(/\/$/, "") : u.pathname;
    return u.origin + path + u.search;
  } catch {
    return null;
  }
}

/**
 * Inject the __DOOGO_CACHED__ flag into cached HTML so injected scripts know
 * this is a locally-served page.
 */
function injectCacheFlag(html: string): string {
  const flag = "<script>window.__DOOGO_CACHED__=true;</script>";
  const patched = html.replace(/<head([^>]*)>/i, `<head$1>${flag}`);
  return patched === html ? flag + html : patched;
}

export default function WebViewScreen() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack]     = useState(false);
  const [showSplash, setShowSplash]   = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [currentUrl, setCurrentUrl]   = useState(DOOGO_URL);

  // Native shimmer overlay — shown INSTANTLY on any navigation start.
  // Updated in onShouldStartLoadWithRequest, cleared in handleLoad/handleError.
  const [overlayVisible,  setOverlayVisible]  = useState(false);
  const [overlayPageType, setOverlayPageType] = useState<PageType>("home");

  const [pendingOAuthUrl, setPendingOAuthUrl] = useState<string | null>(null);

  // In-memory HTML cache: cacheKey → flagged HTML string
  const cachedPages = useRef<Map<string, string>>(new Map());

  // When serving from cache we set this ref so onShouldStartLoadWithRequest
  // doesn't try to intercept the source-prop change itself.
  const servingFromCache = useRef<string | null>(null);

  // Set in handleShouldStartLoadWithRequest when we serve from cache;
  // consumed in handleLoad to decide whether to inject section shimmers.
  const isFromCache = useRef(false);

  // Tracks the most-recently-committed navigation URL (stale-closure safe).
  const currentUrlRef = useRef(DOOGO_URL);

  // Whether the initial splash is still showing (stale-closure safe).
  const showSplashRef = useRef(true);

  // WebView source — starts as the real URL; switches to cached HTML when available.
  type WVSource = { uri: string } | { html: string; baseUrl: string };
  const [webViewSource, setWebViewSource] = useState<WVSource>({ uri: DOOGO_URL });

  const { isConnected } = useNetworkStatus();
  const insets = useSafeAreaInsets();

  useBackHandler(webViewRef, canGoBack);

  // Keep the splash ref in sync with state.
  useEffect(() => { showSplashRef.current = showSplash; }, [showSplash]);

  // ── Google OAuth via modal WebView ──────────────────────────────────────────
  // Called by OAuthModal when its WebView navigates back to doogo.shop.
  // Flush the account/wishlist cache and hard-navigate to /my-account so the
  // user lands on a fresh, logged-in page.
  const handleOAuthComplete = useCallback(() => {
    setPendingOAuthUrl(null);
    const staleKeys = [
      cacheKeyFor("https://doogo.shop/my-account"),
      cacheKeyFor("https://doogo.shop/my-account/?et-wishlist-page"),
    ];
    staleKeys.forEach((k) => k && cachedPages.current.delete(k));
    // Small delay gives the Modal slide-down animation time to finish.
    setTimeout(() => {
      setWebViewSource({ uri: "https://doogo.shop/my-account" });
    }, 350);
  }, []);

  // Called when the user manually closes the OAuth modal without completing auth.
  const handleOAuthDismiss = useCallback(() => {
    setPendingOAuthUrl(null);
  }, []);

  // ── Navigation state ────────────────────────────────────────────────────────
  const handleNavigationStateChange = useCallback((navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    if (navState.url) {
      setCurrentUrl(navState.url);
      currentUrlRef.current = navState.url;
    }
  }, []);

  // ── URL gating + cache-first serving ────────────────────────────────────────
  const handleShouldStartLoadWithRequest = useCallback(
    (request: { url: string }) => {
      try {
        const url = new URL(request.url);
        const host = url.hostname.replace(/^www\./, "");

        const isTrusted = TRUSTED_DOMAINS.some(
          (d) => host === d.replace(/^www\./, "")
        );

        if (!isTrusted) {
          if (isGoogleAuthUrl(request.url)) setPendingOAuthUrl(request.url);
          return false;
        }

        // Cart and compare: pass straight through, no overlay.
        const { pathname, search } = url;
        const isExcluded =
          pathname === "/cart" || pathname === "/cart/" ||
          ((pathname === "/my-account" || pathname === "/my-account/") &&
            search.includes("et-compare-page"));
        if (isExcluded) return true;

        // Allow the source-prop navigation we already triggered for cached pages.
        const key = cacheKeyFor(request.url);
        if (servingFromCache.current && servingFromCache.current === key) {
          return true;
        }

        // Cache hit → serve instantly from memory, NO overlay needed.
        // The cached HTML renders in < 100 ms — no shimmer required.
        if (key && cachedPages.current.has(key)) {
          const cachedHtml = cachedPages.current.get(key)!;
          servingFromCache.current = key;
          isFromCache.current = true;
          setWebViewSource({ html: cachedHtml, baseUrl: key });
          setTimeout(() => { servingFromCache.current = null; }, 1500);
          return false;
        }

        // Network load — show the native shimmer overlay INSTANTLY.
        // Only skip if the initial splash screen is still up (covers everything).
        if (!showSplashRef.current) {
          setOverlayPageType(pageTypeFor(request.url));
          setOverlayVisible(true);
        }

        return true;
      } catch {
        return false;
      }
    },
    []
  );

  // ── Page load complete ──────────────────────────────────────────────────────
  const handleLoad = useCallback(() => {
    setShowSplash(false);
    showSplashRef.current = false;
    setRefreshing(false);

    // Always hide the native overlay (safe to call even if it wasn't showing).
    setOverlayVisible(false);

    const fromCache = isFromCache.current;
    isFromCache.current = false;

    if (fromCache) {
      // ── Cached page: inject section-level shimmers ──────────────────────
      // Skip home — the section shimmers cause visible glitching there.
      // For other pages, overlay specific content zones while images/CSS load;
      // sectionShimmerJS() self-cleans on window.load.
      try {
        const u = new URL(currentUrlRef.current);
        const isHome = u.pathname === "/" || u.pathname === "";
        if (!isHome) {
          webViewRef.current?.injectJavaScript(
            sectionShimmerJS(u.pathname, u.search)
          );
        }
      } catch { /* malformed URL — skip */ }
    } else {
      // ── Network page: cache HTML for instant serving next time ─────────
      // Captured at DOMContentLoaded time so the full document structure is
      // available. Replaces any previously cached version.
      webViewRef.current?.injectJavaScript(
        `(function(){` +
          `try{` +
            `if(window.__DOOGO_CACHED__)return;` +
            `var h=document.documentElement.outerHTML;` +
            `var u=window.location.href.split('#')[0];` +
            `if(window.ReactNativeWebView)` +
              `window.ReactNativeWebView.postMessage(` +
                `JSON.stringify({type:'page-cache',url:u,html:h})` +
              `);` +
          `}catch(e){}` +
        `})();true;`
      );
    }

    // ── Warm-up fetch (runs once, from home, to pre-cache key pages) ────────
    webViewRef.current?.injectJavaScript(DOOGO_RUNTIME_JS);
  }, []);

  const handleError = useCallback(() => {
    setShowSplash(false);
    showSplashRef.current = false;
    setRefreshing(false);
    setOverlayVisible(false);
  }, []);

  // ── Messages from injected JS ───────────────────────────────────────────────
  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);

        if (msg.type === "inject-error") {
          console.warn("[WebView injection error]", msg.msg);
          return;
        }

        if (msg.type === "page-cache" && msg.url && msg.html) {
          const key = cacheKeyFor(msg.url as string);
          if (key) {
            const flaggedHtml = injectCacheFlag(msg.html as string);
            cachedPages.current.set(key, flaggedHtml);
            webViewRef.current?.injectJavaScript(
              `(window.__DOOGO_CACHE_KEYS__=window.__DOOGO_CACHE_KEYS__||new Set()).add(${JSON.stringify(key)});true;`
            );
          }
        }
      } catch {
        // Non-JSON messages from the site — ignore.
      }
    },
    []
  );

  const handleRetry = useCallback(() => {
    webViewRef.current?.reload();
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    webViewRef.current?.reload();
  }, []);

  if (!isConnected) {
    return <OfflineScreen onRetry={handleRetry} />;
  }

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  let currentPath = "/";
  try { currentPath = new URL(currentUrl).pathname; } catch {}
  const showBackBtn = currentPath.startsWith("/product/") && canGoBack;

  const sharedWebViewProps = {
    ref: webViewRef,
    source: webViewSource,
    style: styles.webview,
    javaScriptEnabled: true,
    domStorageEnabled: true,
    thirdPartyCookiesEnabled: true,
    sharedCookiesEnabled: true,
    allowsInlineMediaPlayback: true,
    mediaPlaybackRequiresUserAction: false,
    injectedJavaScriptBeforeContentLoaded: DOOGO_INJECTED_JS_BEFORE,
    injectedJavaScript: DOOGO_INJECTED_JS,
    onMessage: handleMessage,
    onNavigationStateChange: handleNavigationStateChange,
    onShouldStartLoadWithRequest: handleShouldStartLoadWithRequest,
    onLoad: handleLoad,
    onError: handleError,
    allowFileAccess: true,
    geolocationEnabled: false,
    cacheEnabled: true,
    cacheMode: "LOAD_CACHE_ELSE_NETWORK" as const,
    startInLoadingState: false,
    scrollEnabled: true,
    showsHorizontalScrollIndicator: false,
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {Platform.OS === "web" ? (
        <WebView {...sharedWebViewProps} bounces={false} />
      ) : (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.flex}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#0d1f2d"
              colors={["#0d1f2d"]}
            />
          }
          scrollEnabled={false}
        >
          <WebView {...sharedWebViewProps} bounces />
        </ScrollView>
      )}

      {/* Native shimmer overlay — appears INSTANTLY on navigation start,
          above the WebView but below the splash and back button. */}
      <NativeShimmerOverlay
        visible={overlayVisible}
        pageType={overlayPageType}
      />

      {showBackBtn && (
        <TouchableOpacity
          style={[styles.backBtn, { top: insets.top + 12 }]}
          onPress={() => webViewRef.current?.goBack()}
          activeOpacity={0.75}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {Platform.OS === "ios" ? (
            <BlurView intensity={72} tint="light" style={styles.backBtnInner}>
              <Ionicons name="chevron-back" size={22} color="#1a1a1a" />
            </BlurView>
          ) : (
            <View style={[styles.backBtnInner, styles.backBtnAndroid]}>
              <Ionicons name="chevron-back" size={22} color="#1a1a1a" />
            </View>
          )}
        </TouchableOpacity>
      )}

      <SplashOverlay visible={showSplash} />

      {/* Modal WebView for Google OAuth — auto-closes when it lands on doogo.shop */}
      <OAuthModal
        visible={!!pendingOAuthUrl}
        startUrl={pendingOAuthUrl ?? ""}
        onComplete={handleOAuthComplete}
        onDismiss={handleOAuthDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  flex: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 9999,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  backBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnAndroid: {
    backgroundColor: "rgba(255,255,255,0.92)",
  },
});
