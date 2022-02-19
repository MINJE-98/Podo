import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall } from "@usedapp/core";
import groupContractAbi from "../abi/Group.json";
import { groupContractAddress } from "../contracts";

import { useContractFunction } from "../utils/workaround";
declare const window: any;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const groupContractInterface = new ethers.utils.Interface(groupContractAbi);
const contract = new Contract(
  groupContractAddress,
  groupContractInterface,
  signer
);

export function useGetGroupsList() {
  const [groupList]: any =
    useContractCall({
      abi: groupContractInterface,
      address: groupContractAddress,
      method: "getGroupsList",
      args: [],
    }) ?? [];
  return groupList;
}

export function useGetGroupInfoFromAddress(address: any) {
  const [groupInfo]: any =
    useContractCall({
      abi: groupContractInterface,
      address: groupContractAddress,
      method: "getGroupInfoFromAddress",
      args: [address],
    }) ?? [];
  return groupInfo;
}

export function useHasGroup(address: any) {
  const [hasGroup]: any =
    useContractCall({
      abi: groupContractInterface,
      address: groupContractAddress,
      method: "hasGroup",
      args: [address],
    }) ?? [];
  return hasGroup;
}
export function useCreateGroupInfo() {
  const { state, send } = useContractFunction(contract, "createGroupInfo", 3);
  return { state, send };
}

export function useContractMethod(methodName: string) {
  const { state, send } = useContractFunction(contract, methodName, 3);
  return { state, send };
}
