"use client";

import { useCallback, useState } from "react";
import { connectWallet } from "~~/utils/eventra/contract";

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);

  const connect = useCallback(async () => {
    const { signer, address } = await connectWallet();
    setAddress(address);
    return signer;
  }, []);

  return { address, connect };
};
