import { useEffect } from "react";
import { BackHandler, Platform } from "react-native";
import WebView from "react-native-webview";
import React from "react";

export function useBackHandler(
  webViewRef: React.RefObject<WebView | null>,
  canGoBack: boolean
) {
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const handler = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    BackHandler.addEventListener("hardwareBackPress", handler);
    return () => BackHandler.removeEventListener("hardwareBackPress", handler);
  }, [canGoBack, webViewRef]);
}
