import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const LOGO_SIZE = SCREEN_WIDTH * 0.5;
const SPLASH_BG = "#e6fffa";

interface SplashOverlayProps {
  visible: boolean;
  onFadeComplete?: () => void;
}

export default function SplashOverlay({ visible, onFadeComplete }: SplashOverlayProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.06,
          duration: 1400,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.0,
          duration: 1400,
          useNativeDriver: false,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [scaleAnim]);

  useEffect(() => {
    if (!visible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        onFadeComplete?.();
      });
    }
  }, [visible, fadeAnim, onFadeComplete]);

  if (fadeAnim.__getValue() === 0) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.Image
        source={require("../assets/images/doogo_logo.png")}
        style={[
          styles.logo,
          {
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SPLASH_BG,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  logo: {
    resizeMode: "contain",
  },
});
