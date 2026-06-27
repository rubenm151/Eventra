"use client";

import { useCallback, useEffect, useState } from "react";
import { connectWallet } from "~~/utils/eventra/contract";

const getEth = () => (typeof window !== "undefined" ? (window as any).ethereum : undefined);
const DISCONNECTED_KEY = "eventra:wallet-disconnected";

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);

  // Restaura la cuenta autorizada (sin popup) salvo que el usuario hiciera logout.
  useEffect(() => {
    const eth = getEth();
    if (!eth) return;

    if (!localStorage.getItem(DISCONNECTED_KEY)) {
      eth
        .request({ method: "eth_accounts" })
        .then((accs: string[]) => setAddress(accs[0] ?? null))
        .catch(() => {});
    }

    const onAccountsChanged = (accs: string[]) => {
      if (localStorage.getItem(DISCONNECTED_KEY)) return;
      setAddress(accs[0] ?? null);
    };
    eth.on?.("accountsChanged", onAccountsChanged);
    return () => eth.removeListener?.("accountsChanged", onAccountsChanged);
  }, []);

  const connect = useCallback(async () => {
    localStorage.removeItem(DISCONNECTED_KEY);
    const { signer, address } = await connectWallet();
    setAddress(address);
    return signer;
  }, []);

  const disconnect = useCallback(() => {
    localStorage.setItem(DISCONNECTED_KEY, "1");
    setAddress(null);
  }, []);

  return { address, connect, disconnect };
};
