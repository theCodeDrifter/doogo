// ─── Skeleton card builders ───────────────────────────────────────────────────

function skCard(): string {
  return (
    `<div style="flex-shrink:0;width:140px;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.06);">` +
    `<div class="dg-sk" style="width:100%;height:140px;"></div>` +
    `<div style="padding:8px 10px 10px;">` +
    `<div class="dg-sk" style="height:12px;width:80%;border-radius:6px;margin-bottom:6px;"></div>` +
    `<div class="dg-sk" style="height:12px;width:50%;border-radius:6px;"></div>` +
    `</div></div>`
  );
}
function skGridCard(): string {
  return (
    `<div style="border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 1px 6px rgba(0,0,0,.06);">` +
    `<div class="dg-sk" style="width:100%;height:130px;"></div>` +
    `<div style="padding:8px 10px 12px;">` +
    `<div class="dg-sk" style="height:12px;width:85%;border-radius:6px;margin-bottom:6px;"></div>` +
    `<div class="dg-sk" style="height:12px;width:45%;border-radius:6px;"></div>` +
    `</div></div>`
  );
}
function skListItem(): string {
  return (
    `<div style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid #f2f2f2;">` +
    `<div class="dg-sk" style="width:72px;height:72px;border-radius:10px;flex-shrink:0;"></div>` +
    `<div style="flex:1;">` +
    `<div class="dg-sk" style="height:12px;width:75%;border-radius:6px;margin-bottom:7px;"></div>` +
    `<div class="dg-sk" style="height:12px;width:40%;border-radius:6px;margin-bottom:7px;"></div>` +
    `<div class="dg-sk" style="height:12px;width:30%;border-radius:6px;"></div>` +
    `</div></div>`
  );
}
function skCartItem(): string {
  return (
    `<div style="display:flex;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid #f2f2f2;">` +
    `<div class="dg-sk" style="width:80px;height:80px;border-radius:10px;flex-shrink:0;"></div>` +
    `<div style="flex:1;">` +
    `<div class="dg-sk" style="height:12px;width:80%;border-radius:6px;margin-bottom:8px;"></div>` +
    `<div class="dg-sk" style="height:12px;width:35%;border-radius:6px;margin-bottom:10px;"></div>` +
    `<div style="display:flex;justify-content:space-between;">` +
    `<div class="dg-sk" style="height:28px;width:88px;border-radius:8px;"></div>` +
    `<div class="dg-sk" style="height:12px;width:52px;border-radius:6px;margin-top:8px;"></div>` +
    `</div></div></div>`
  );
}

// ─── Skeleton blocks ──────────────────────────────────────────────────────────

const SK_HORIZ =
  `<div style="display:flex;gap:12px;overflow:hidden;padding:2px 0 14px;">` +
  [0,1,2,3].map(skCard).join("") + `</div>`;

const SK_GRID =
  `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">` +
  [0,1,2,3,4,5].map(skGridCard).join("") + `</div>`;

const SK_LIST = [0,1,2,3,4].map(skListItem).join("");

const SK_CART =
  [0,1,2].map(skCartItem).join("") +
  `<div style="margin-top:20px;padding:16px;background:#f9f9f9;border-radius:12px;">` +
  `<div class="dg-sk" style="height:13px;width:50%;border-radius:6px;margin-bottom:12px;"></div>` +
  `<div class="dg-sk" style="height:13px;width:70%;border-radius:6px;margin-bottom:12px;"></div>` +
  `<div class="dg-sk" style="height:44px;width:100%;border-radius:10px;margin-top:16px;"></div>` +
  `</div>`;

const SK_ACCOUNT =
  `<div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">` +
  `<div class="dg-sk" style="width:64px;height:64px;border-radius:32px;"></div>` +
  `<div><div class="dg-sk" style="height:14px;width:130px;border-radius:6px;margin-bottom:8px;"></div>` +
  `<div class="dg-sk" style="height:12px;width:100px;border-radius:6px;"></div></div></div>` +
  [0,1,2,3,4].map(() =>
    `<div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid #f2f2f2;">` +
    `<div class="dg-sk" style="width:36px;height:36px;border-radius:8px;flex-shrink:0;"></div>` +
    `<div class="dg-sk" style="height:12px;width:60%;border-radius:6px;"></div></div>`
  ).join("");

// ─── Full-page skeleton layouts (used for non-cached pages) ──────────────────

const SK_PAGE_HOME =
  `<div style="padding:16px;">` +
  [0,1,2].map(() =>
    `<div style="margin-bottom:22px;">` +
    `<div class="dg-sk" style="height:14px;width:40%;border-radius:6px;margin-bottom:12px;"></div>` +
    SK_HORIZ + `</div>`
  ).join("") + `</div>`;

const SK_PAGE_SHOP  = `<div style="padding:16px;">${SK_GRID}</div>`;
const SK_PAGE_WISH  = `<div style="padding:0 16px;">${SK_LIST}</div>`;
const SK_PAGE_CART  = `<div style="padding:0 16px;">${SK_CART}</div>`;
const SK_PAGE_ACCT  = `<div style="padding:24px 16px 16px;">${SK_ACCOUNT}</div>`;

const SK_PAGE_PROD =
  `<div class="dg-sk" style="width:100%;height:300px;border-radius:0;"></div>` +
  `<div style="padding:20px 16px;">` +
  `<div class="dg-sk" style="height:18px;width:90%;border-radius:7px;margin-bottom:10px;"></div>` +
  `<div class="dg-sk" style="height:18px;width:55%;border-radius:7px;margin-bottom:16px;"></div>` +
  `<div class="dg-sk" style="height:24px;width:35%;border-radius:7px;margin-bottom:20px;"></div>` +
  [95,80,88,65].map(w =>
    `<div class="dg-sk" style="height:12px;width:${w}%;border-radius:6px;margin-bottom:8px;"></div>`
  ).join("") +
  `<div class="dg-sk" style="height:50px;width:100%;border-radius:12px;margin-top:24px;"></div></div>`;

const SK_PAGE_CHECK =
  `<div style="padding:20px 16px;">` +
  [140,180].map(w =>
    `<div style="margin-bottom:24px;">` +
    `<div class="dg-sk" style="height:14px;width:${w}px;border-radius:6px;margin-bottom:16px;"></div>` +
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">` +
    `<div class="dg-sk" style="height:48px;border-radius:10px;"></div>` +
    `<div class="dg-sk" style="height:48px;border-radius:10px;"></div></div>` +
    `<div class="dg-sk" style="height:48px;border-radius:10px;margin-top:12px;"></div>` +
    `<div class="dg-sk" style="height:48px;border-radius:10px;margin-top:12px;"></div></div>`
  ).join("") +
  `<div style="background:#f9f9f9;border-radius:12px;padding:16px;margin-bottom:20px;">` +
  [0,1,2].map(() =>
    `<div style="display:flex;justify-content:space-between;margin-bottom:10px;">` +
    `<div class="dg-sk" style="height:12px;width:40%;border-radius:6px;"></div>` +
    `<div class="dg-sk" style="height:12px;width:20%;border-radius:6px;"></div></div>`
  ).join("") +
  `</div><div class="dg-sk" style="height:52px;border-radius:12px;"></div></div>`;

const SK_PAGE_DEFAULT =
  `<div style="padding:20px 16px;">` +
  `<div class="dg-sk" style="height:180px;border-radius:12px;margin-bottom:20px;"></div>` +
  [0,1,2].map(() =>
    `<div style="margin-bottom:20px;">` +
    `<div class="dg-sk" style="height:14px;width:55%;border-radius:6px;margin-bottom:10px;"></div>` +
    `<div class="dg-sk" style="height:12px;width:90%;border-radius:6px;margin-bottom:7px;"></div>` +
    `<div class="dg-sk" style="height:12px;width:75%;border-radius:6px;"></div></div>`
  ).join("") + `</div>`;

// ─── Public path→skeleton helper (used by React Native) ──────────────────────
export function skelHTMLForPath(path: string): string {
  if (!path || path === "/" || path === "") return SK_PAGE_HOME;
  if (path.startsWith("/shop") || path.startsWith("/product-category/")) return SK_PAGE_SHOP;
  if (path.startsWith("/wishlist"))   return SK_PAGE_WISH;
  if (path.startsWith("/cart"))       return SK_PAGE_CART;
  if (path.startsWith("/my-account")) return SK_PAGE_ACCT;
  if (path.startsWith("/product/"))   return SK_PAGE_PROD;
  if (path.startsWith("/checkout"))   return SK_PAGE_CHECK;
  return SK_PAGE_DEFAULT;
}

// ─── Shared CSS ───────────────────────────────────────────────────────────────
const ALL_CSS =
  "body{overflow-x:hidden!important}" +
  "html{overflow-x:hidden!important}" +
  ".elementor-element-8d79317,.elementor-element-a6cfc58,.elementor-element-5abdb2{display:none!important}" +
  ".elementor-element-58ced7a{display:block!important;visibility:visible!important;opacity:1!important;max-height:none!important;overflow:visible!important}" +
  // Site sticky nav always above our overlays
  ".etheme-sticky-panel{display:block!important;visibility:visible!important;opacity:1!important;z-index:99999!important}" +
  "@keyframes dg-sh{0%{background-position:-600px 0}100%{background-position:600px 0}}" +
  ".dg-sk{background:linear-gradient(90deg,#f0f0f0 25%,#e4e4e4 50%,#f0f0f0 75%);background-size:600px 100%;animation:dg-sh 1.4s ease-in-out infinite;border-radius:8px}" +
  // Full-page overlay
  "#__dg_ov__{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99997;background:#fff;overflow:hidden;transition:opacity .25s ease}" +
  "#__dg_ov__.dg-out{opacity:0;pointer-events:none}" +
  // Section overlays (absolute inside their target element)
  ".dg-sec-ov{position:absolute;top:0;left:0;right:0;bottom:0;background:#fff;z-index:100;overflow:hidden;padding:12px;box-sizing:border-box}";

const js = JSON.stringify.bind(JSON);

// ─── BEFORE CONTENT ───────────────────────────────────────────────────────────
// Fires before any pixel renders (injectedJavaScriptBeforeContentLoaded).
// Kept intentionally minimal: CSS injection ONLY.
//
// All shimmer/skeleton states are handled by the React Native NativeShimmerOverlay
// which appears instantly on navigation start (onShouldStartLoadWithRequest) and
// sits above the WebView — no WebView JS injection needed for loading UX.
//
// This script only needs to ensure:
//  1. Element hide/show overrides apply before any content renders (no flash)
//  2. Shimmer animation CSS is available for sectionShimmerJS (injected post-load)
export const INJECTED_JS_BEFORE = `
try{
  if(!document.getElementById('dg-style')){
    var _s=document.createElement('style');_s.id='dg-style';
    _s.textContent=${js(ALL_CSS)};
    (document.head||document.documentElement).appendChild(_s);
  }
}catch(e){}
true;
`;

// ─── Section shimmer injector ──────────────────────────────────────────────────
// Returns JS to inject section-level shimmers for a given page and remove them
// when all resources finish loading.  Called imperatively from handleLoad for
// pages served from the in-memory HTML cache.
// Returns 'true;' (no-op) for pages with no defined section targets.
export function sectionShimmerJS(pathname: string, search: string): string {
  const p = (pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname) || '/';

  type Pair = [string, string];
  let targets: Pair[] | null = null;

  if (p === '/' || p === '') {
    targets = [
      ['.elementor-element-a847a98', SK_HORIZ],
      ['.elementor-element-497b92f', SK_HORIZ],
      ['.elementor-element-a0309c1', SK_HORIZ],
    ];
  } else if (p.startsWith('/shop') || p.startsWith('/product-category/')) {
    targets = [
      ['.elementor-element-71c08e94', SK_GRID],
      ['ul.products', SK_GRID],
    ];
  } else if (p === '/my-account') {
    if (search.includes('et-wishlist-page')) {
      targets = [
        ['.woocommerce-wishlist', SK_LIST],
        ['.et-wishlist-wrapper',  SK_LIST],
      ];
    } else if (!search) {
      targets = [
        ['.elementor-element-14bfd8e',         SK_ACCOUNT],
        ['.woocommerce-MyAccount-content', SK_ACCOUNT],
      ];
    }
  }

  if (!targets) return 'true;';

  return `
(function(){
  var T=${js(targets)};
  function rmSk(){
    document.querySelectorAll('.dg-sec-ov').forEach(function(el){
      if(el.parentNode)el.parentNode.removeChild(el);
    });
  }
  function addSk(){
    var ok=false;
    T.forEach(function(pr){
      var el=document.querySelector(pr[0]);
      if(!el||el.querySelector('.dg-sec-ov'))return;
      el.style.position='relative';
      var ov=document.createElement('div');
      ov.className='dg-sec-ov';ov.innerHTML=pr[1];
      el.insertBefore(ov,el.firstChild);
      ok=true;
    });
    return ok;
  }
  var n=0;
  function retry(){if(addSk())return;if(++n<8)setTimeout(retry,250);}
  retry();
  if(document.readyState==='complete'){
    setTimeout(rmSk,200);
  } else {
    window.addEventListener('load',function(){setTimeout(rmSk,200);},{once:true});
  }
})();
true;
`;
}

// ─── MAIN INJECTION (prop) ────────────────────────────────────────────────────
// injectedJavaScript prop — fires AFTER page load, unreliable on Android.
// All loading UX is now handled by the React Native NativeShimmerOverlay and
// section shimmers injected from handleLoad via sectionShimmerJS().
// This script is kept only as a CSS safety net.
export const INJECTED_JS = `
try{
(function(){
  if(window.__DOOGO_INJ__)return;
  window.__DOOGO_INJ__=true;

  // CSS safety net — ensures styles are present even if INJECTED_JS_BEFORE
  // was somehow skipped (e.g., very old Android WebView quirk).
  if(!document.getElementById('dg-style')){
    var _st=document.createElement('style');_st.id='dg-style';
    _st.textContent=${js(ALL_CSS)};
    (document.head||document.documentElement).appendChild(_st);
  }

  // Viewport lock
  (function(){
    var vp=document.querySelector('meta[name="viewport"]');
    if(vp)vp.setAttribute('content','width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no');
    else{var m=document.createElement('meta');m.name='viewport';
      m.content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no';
      (document.head||document.documentElement).appendChild(m);}
  })();

})();
}catch(e){
  if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify({type:'inject-error',msg:String(e&&e.message||e)}));
}
true;
`;

// ─── RUNTIME JS ───────────────────────────────────────────────────────────────
// Injected imperatively from handleLoad (onLoad).
// Responsibility: warm-up fetch to populate the in-memory page cache.
//
// All shimmer/navigation UX is now handled by the React Native NativeShimmerOverlay.
// No click interceptor is needed here — the native overlay fires via
// onShouldStartLoadWithRequest which is synchronous with the tap.
export const RUNTIME_JS = `
(function(){
  var pth=window.location.pathname||'';

  // ── Warm-up fetch ────────────────────────────────────────────────────────
  // Runs once, 1 s after the home page loads, using the WebView's own cookies
  // so the cached HTML reflects the user's logged-in session.
  // Home is excluded — it is already being cached via the visit-time injection.
  if(!window.__DOOGO_WF__&&(pth==='/'||pth==='')&&window.ReactNativeWebView){
    window.__DOOGO_WF__=true;
    setTimeout(function(){
      [
        'https://doogo.shop/shop',
        'https://doogo.shop/my-account/?et-wishlist-page',
        'https://doogo.shop/my-account',
      ].forEach(function(url){
        fetch(url,{credentials:'include'})
          .then(function(r){return r&&r.status===200?r.text():null;})
          .then(function(html){
            if(!html)return;
            window.ReactNativeWebView.postMessage(
              JSON.stringify({type:'page-cache',url:url,html:html})
            );
          })
          .catch(function(){});
      });
    },1000);
  }
})();
true;
`;
