import abi from "../../foundry/out/EventraContract.sol/EventraContract.json";
// Lee la dirección del último deploy de foundry (chainId 31337) → no hay que tocar .env al redeplegar.
import broadcast from "../../foundry/broadcast/Deploy.s.sol/31337/run-latest.json";

const deployedAddress = (broadcast.transactions as any[]).find(t => t.transactionType === "CREATE")?.contractAddress as
  | string
  | undefined;

export const EVENTRA_ABI = abi.abi;
export const EVENTRA_ADDRESS = (deployedAddress ?? process.env.NEXT_PUBLIC_EVENTRA_ADDRESS) as string;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID);
