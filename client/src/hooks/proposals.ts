import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall } from "@usedapp/core";
import governorContractAbi from "../abi/Governor.json";
import { governorContractAddress } from "../contracts";

import { useContractFunction } from "../utils/workaround";
declare const window: any;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const governotContractInterface = new ethers.utils.Interface(
  governorContractAbi
);
const contract = new Contract(
  governorContractAddress,
  governotContractInterface,
  signer
);

export function useGetProposalInfo(proposalId: any, campaignId: any) {
  const [proposalInfo]: any =
    useContractCall({
      abi: governotContractInterface,
      address: governorContractAddress,
      method: "getProposalInfo",
      args: [proposalId, campaignId],
    }) ?? [];
  return proposalInfo;
}

export function useGetProposalLength(campaignId: any) {
  const [proposalLength]: any =
    useContractCall({
      abi: governotContractInterface,
      address: governorContractAddress,
      method: "getProposalLength",
      args: [campaignId],
    }) ?? [];
  return proposalLength;
}

export function useProposalState(campaignId: any, proposalId: any) {
  const [proposalState]: any =
    useContractCall({
      abi: governotContractInterface,
      address: governorContractAddress,
      method: "proposalState",
      args: [campaignId, proposalId],
    }) ?? [];
  return proposalState;
}

export function useCreateProposal() {
  const { state, send } = useContractFunction(contract, "createPropose", 3);
  return { state, send };
}

export function useCastVote() {
  const { state, send } = useContractFunction(contract, "castVote", 3);
  return { state, send };
}

export function useExecuteProse() {
  const { state, send } = useContractFunction(contract, "executeProse", 3);
  return { state, send };
}
