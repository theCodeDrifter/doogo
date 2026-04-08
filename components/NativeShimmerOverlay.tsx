import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet, Platform, type DimensionValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type PageType =
  | "home"
  | "shop"
  | "wishlist"
  | "account"
  | "product"
  | "checkout"
  | "default";

interface Props {
  visible: boolean;
  pageType: PageType;
}

const C = "#e8e8e8";
const C2 = "#f4f4f4";

function Sk({
  p,
  h,
  w = "100%",
  r = 8,
  mb = 0,
  mt = 0,
  ml = 0,
  mr = 0,
  flex,
}: {
  p: Animated.Value;
  h: number;
  w?: DimensionValue;
  r?: number;
  mb?: number;
  mt?: number;
  ml?: number;
  mr?: number;
  flex?: number;
}) {
  const opacity = p.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  return (
    <Animated.View
      style={{
        height: h,
        width: w,
        borderRadius: r,
        backgroundColor: C,
        opacity,
        marginBottom: mb,
        marginTop: mt,
        marginLeft: ml,
        marginRight: mr,
        flex,
      }}
    />
  );
}

function Card({ p, imgH = 140 }: { p: Animated.Value; imgH?: number }) {
  return (
    <View
      style={{
        width: 140,
        marginRight: 12,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: C2,
        flexShrink: 0,
      }}
    >
      <Sk p={p} h={imgH} r={0} />
      <View style={{ padding: 8 }}>
        <Sk p={p} h={11} w="80%" mb={6} />
        <Sk p={p} h={11} w="50%" />
      </View>
    </View>
  );
}

function GridCard({ p }: { p: Animated.Value }) {
  return (
    <View
      style={{ borderRadius: 12, overflow: "hidden", backgroundColor: C2, flex: 1 }}
    >
      <Sk p={p} h={130} r={0} />
      <View style={{ padding: 8 }}>
        <Sk p={p} h={11} w="85%" mb={6} />
        <Sk p={p} h={11} w="45%" />
      </View>
    </View>
  );
}

function HorizRow({ p, label = true }: { p: Animated.Value; label?: boolean }) {
  return (
    <View style={{ marginBottom: 22 }}>
      {label && <Sk p={p} h={13} w="40%" mb={12} />}
      <View style={{ flexDirection: "row" }}>
        {[0, 1, 2, 3].map((i) => (
          <Card key={i} p={p} />
        ))}
      </View>
    </View>
  );
}

function ListItem({ p }: { p: Animated.Value }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
      }}
    >
      <Sk p={p} h={72} w={72} r={10} mr={14} />
      <View style={{ flex: 1 }}>
        <Sk p={p} h={11} w="75%" mb={7} />
        <Sk p={p} h={11} w="40%" mb={7} />
        <Sk p={p} h={11} w="30%" />
      </View>
    </View>
  );
}

function HomeSkeleton({ p }: { p: Animated.Value }) {
  return (
    <View style={styles.pad}>
      <HorizRow p={p} />
      <HorizRow p={p} />
      <HorizRow p={p} />
    </View>
  );
}

function ShopSkeleton({ p }: { p: Animated.Value }) {
  return (
    <View style={styles.pad}>
      <Sk p={p} h={44} mb={16} r={10} />
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <GridCard key={i} p={p} />
        ))}
      </View>
    </View>
  );
}

function WishlistSkeleton({ p }: { p: Animated.Value }) {
  return (
    <View style={styles.pad}>
      <Sk p={p} h={14} w="50%" mb={20} />
      {[0, 1, 2, 3, 4].map((i) => (
        <ListItem key={i} p={p} />
      ))}
    </View>
  );
}

function AccountSkeleton({ p }: { p: Animated.Value }) {
  return (
    <View style={styles.pad}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 24 }}>
        <Sk p={p} h={64} w={64} r={32} mr={16} />
        <View>
          <Sk p={p} h={13} w={130} mb={8} />
          <Sk p={p} h={11} w={100} />
        </View>
      </View>
      {[0, 1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: "#f0f0f0",
          }}
        >
          <Sk p={p} h={36} w={36} r={8} mr={12} />
          <Sk p={p} h={11} w="60%" />
        </View>
      ))}
    </View>
  );
}

function ProductSkeleton({ p }: { p: Animated.Value }) {
  return (
    <View>
      <Sk p={p} h={300} r={0} />
      <View style={styles.pad}>
        <Sk p={p} h={18} w="90%" mb={10} />
        <Sk p={p} h={18} w="55%" mb={16} />
        <Sk p={p} h={24} w="35%" mb={20} />
        {[95, 80, 88, 65].map((w, i) => (
          <Sk key={i} p={p} h={11} w={`${w}%`} mb={8} />
        ))}
        <Sk p={p} h={50} mt={24} r={12} />
      </View>
    </View>
  );
}

function CheckoutSkeleton({ p }: { p: Animated.Value }) {
  return (
    <View style={styles.pad}>
      {[0, 1].map((i) => (
        <View key={i} style={{ marginBottom: 24 }}>
          <Sk p={p} h={13} w={i === 0 ? 140 : 180} mb={16} />
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            <Sk p={p} h={48} flex={1} r={10} />
            <Sk p={p} h={48} flex={1} r={10} />
          </View>
          <Sk p={p} h={48} r={10} mb={12} />
          <Sk p={p} h={48} r={10} />
        </View>
      ))}
      <Sk p={p} h={52} r={12} />
    </View>
  );
}

function DefaultSkeleton({ p }: { p: Animated.Value }) {
  return (
    <View style={styles.pad}>
      <Sk p={p} h={200} r={12} mb={20} />
      <HorizRow p={p} label={false} />
      <Sk p={p} h={13} w="55%" mb={10} />
      <Sk p={p} h={11} w="90%" mb={7} />
      <Sk p={p} h={11} w="75%" mb={20} />
      <Sk p={p} h={13} w="40%" mb={10} />
      <Sk p={p} h={11} w="85%" mb={7} />
      <Sk p={p} h={11} w="60%" />
    </View>
  );
}

export default function NativeShimmerOverlay({ visible, pageType }: Props) {
  const insets = useSafeAreaInsets();
  // Match the container's top padding so the skeleton starts exactly where the
  // WebView content starts (below the status bar / notch).
  const topOffset = Platform.OS === "web" ? 67 : insets.top;

  const pulse = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: visible ? 0 : 220,
      useNativeDriver: true,
    }).start();
  }, [visible, fadeAnim]);

  const renderSkeleton = () => {
    switch (pageType) {
      case "home":      return <HomeSkeleton p={pulse} />;
      case "shop":      return <ShopSkeleton p={pulse} />;
      case "wishlist":  return <WishlistSkeleton p={pulse} />;
      case "account":   return <AccountSkeleton p={pulse} />;
      case "product":   return <ProductSkeleton p={pulse} />;
      case "checkout":  return <CheckoutSkeleton p={pulse} />;
      default:          return <DefaultSkeleton p={pulse} />;
    }
  };

  return (
    <Animated.View
      style={[styles.overlay, { opacity: fadeAnim, top: topOffset }]}
      pointerEvents="none"
    >
      {renderSkeleton()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    zIndex: 9998,
    overflow: "hidden",
  },
  pad: {
    padding: 16,
    paddingTop: 20,
  },
});
