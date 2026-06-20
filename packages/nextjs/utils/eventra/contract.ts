import { ethers } from "ethers";

import { EVENTRA_ABI, EVENTRA_ADDRESS, RPC_URL, CHAIN_ID } from "~~/contracts/eventra";

export const getReadContract = () =>
  new ethers.Contract(EVENTRA_ADDRESS, EVENTRA_ABI, new ethers.JsonRpcProvider(RPC_URL));

const CHAIN_ID_HEX = "0x" + CHAIN_ID.toString(16);

const ensureChain = async (eth: any) => {
  try {
    await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_ID_HEX }] });
  } catch (err: any) {
    if (err?.code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: CHAIN_ID_HEX,
            chainName: "AnvilTest",
            rpcUrls: [RPC_URL],
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          },
        ],
      });
    } else {
      throw err;
    }
  }
};

export const connectWallet = async () => {
  const eth = (window as any).ethereum;
  if (!eth) throw new Error("Need Metamask");

  await eth.request({ method: "eth_requestAccounts" });
  await ensureChain(eth); // <- salta a AnvilTest antes de firmar nada

  const browser = new ethers.BrowserProvider(eth);
  const signer = await browser.getSigner();

  return { signer, address: await signer.getAddress() };
};

export const getWriteContract = (signer: ethers.Signer) =>
  new ethers.Contract(EVENTRA_ADDRESS, EVENTRA_ABI, signer);
