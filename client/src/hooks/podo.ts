import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall } from "@usedapp/core";
import podoContractAbi from "../abi/Podo.json";
import { podoContractAddress } from "../contracts";

import { useContractFunction } from "../utils/workaround";
declare const window: any;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const podoContractInterface = new ethers.utils.Interface(podoContractAbi);
const contract = new Contract(
  podoContractAddress,
  podoContractInterface,
  signer
);

export function useBalanceOf() {
  const [balanceOf]: any =
    useContractCall({
      abi: podoContractInterface,
      address: podoContractAddress,
      method: "balanceOf",
      args: [],
    }) ?? [];
  return balanceOf;
}

export function useMint() {
  const { state, send } = useContractFunction(contract, "mint", 3);
  return { state, send };
}
export function useContractMethod(methodName: string) {
  const { state, send } = useContractFunction(contract, methodName, 3);
  return { state, send };
}
