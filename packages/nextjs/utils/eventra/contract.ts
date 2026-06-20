import { ethers } from "ethers";

import { EVENTRA_ABI, EVENTRA_ADDRESS, RPC_URL } from "~~/contracts/eventra"

export const getReadContract = () => 
    new ethers.Contract(EVENTRA_ADDRESS, EVENTRA_ABI, new ethers.JsonRpcProvider(RPC_URL))

export const connectWallet = async () => {
    if (!(window as any).ethereum) throw new Error ("Need Metamask");

    const browser = new ethers.BrowserProvider((window as any).ethereum);

    await browser.send("eth_requestAccounts", []);
    const signer = await browser.getSigner();

    return {signer, address: await signer.getAddress()};
    
};
    export const getWriteContract = (signer: ethers.Signer) => 
        new ethers.Contract(EVENTRA_ADDRESS, EVENTRA_ABI, signer);


