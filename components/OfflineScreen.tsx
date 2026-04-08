import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface OfflineScreenProps {
  onRetry: () => void;
}

export default function OfflineScreen({ onRetry }: OfflineScreenProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.secondary }]}>
          <Feather name="wifi-off" size={36} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          No Connection
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          It looks like you're offline. Check your internet connection and try again.
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Feather name="refresh-cw" size={16} color={colors.primaryForeground} />
          <Text style={[styles.retryText, { color: colors.primaryForeground }]}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginTop: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
