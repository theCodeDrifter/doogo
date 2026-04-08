import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? true);
      setIsChecking(false);
    });

    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(state.isConnected ?? true);
      setIsChecking(false);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, isChecking };
}
