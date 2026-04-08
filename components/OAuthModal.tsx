import { Feather } from "@expo/vector-icons";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

// A real browser UA so Google doesn't block the OAuth flow in WebView
const BROWSER_UA =
  Platform.OS === "ios"
    ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    : "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";

// Domains that indicate OAuth is complete and we should close the modal
const DOOGO_DOMAINS = ["doogo.shop", "www.doogo.shop"];

interface OAuthModalProps {
  visible: boolean;
  startUrl: string;
  onComplete: () => void;
  onDismiss: () => void;
}

export default function OAuthModal({
  visible,
  startUrl,
  onComplete,
  onDismiss,
}: OAuthModalProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("Sign in with Google");
  // Prevent onComplete firing more than once per session
  const completedRef = useRef(false);

  // Reset the guard each time the modal becomes visible
  const handleShow = useCallback(() => {
    completedRef.current = false;
    setLoading(true);
    setPageTitle("Sign in with Google");
  }, []);

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      if (completedRef.current) return;

      // Update the title if available
      if (navState.title) setPageTitle(navState.title);

      // Detect when OAuth is done — Google redirects back to doogo.shop
      try {
        const url = new URL(navState.url);
        const host = url.hostname.replace(/^www\./, "");
        const isBackOnDoogo = DOOGO_DOMAINS.some(
          (d) => host === d.replace(/^www\./, "")
        );
        if (isBackOnDoogo) {
          completedRef.current = true;
          onComplete();
        }
      } catch {
        // ignore parse errors
      }
    },
    [onComplete]
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
      onShow={handleShow}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: topPad,
            paddingBottom: bottomPad,
          },
        ]}
      >
        {/* Header bar */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft} />
          <Text
            style={[styles.headerTitle, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {pageTitle}
          </Text>
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: colors.secondary }]}
            onPress={onDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="x" size={18} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* OAuth WebView with real browser UA */}
        <WebView
          ref={webViewRef}
          source={{ uri: startUrl }}
          style={styles.webview}
          userAgent={BROWSER_UA}
          javaScriptEnabled
          domStorageEnabled
          thirdPartyCookiesEnabled
          sharedCookiesEnabled
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          incognito={false}
          cacheEnabled
        />

        {/* Loading bar */}
        {loading && (
          <View style={[styles.loadingBar, { backgroundColor: colors.secondary }]}>
            <ActivityIndicator color={colors.primary} size="small" />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    width: 32,
  },
  headerTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  webview: {
    flex: 1,
  },
  loadingBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
