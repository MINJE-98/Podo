import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useEthers } from "@usedapp/core";
import campaignContractAbi from "../abi/Campaign.json";
import { campaignContractAddress } from "../contracts";

import { useContractFunction } from "../utils/workaround";
declare const window: any;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const campaignContractInterface = new ethers.utils.Interface(
  campaignContractAbi
);
const contract = new Contract(
  campaignContractAddress,
  campaignContractInterface,
  signer
);

export function useGetCampaignsList(address: any) {
  const [campaignList]: any =
    useContractCall({
      abi: campaignContractInterface,
      address: campaignContractAddress,
      method: "getCampaignList",
      args: [address],
    }) ?? [];
  return campaignList;
}

export function useGetCampaignInfo(campaignId: any) {
  const [campaignInfo]: any =
    useContractCall({
      abi: campaignContractInterface,
      address: campaignContractAddress,
      method: "getCampaignInfo",
      args: [campaignId],
    }) ?? [];
  return campaignInfo;
}
export function useGetCampaignLength() {
  const [campaignLength]: any =
    useContractCall({
      abi: campaignContractInterface,
      address: campaignContractAddress,
      method: "getCampaignLength",
      args: [],
    }) ?? [];
  return campaignLength;
}
export function useCampaignState(campaignId: any) {
  const [campaignState]: any =
    useContractCall({
      abi: campaignContractInterface,
      address: campaignContractAddress,
      method: "campaignState",
      args: [campaignId],
    }) ?? [];
  return campaignState;
}
export function useGetCampaignUserLength(campaignId: any) {
  const [donateUserLength]: any =
    useContractCall({
      abi: campaignContractInterface,
      address: campaignContractAddress,
      method: "getCampaignUsersLength",
      args: [campaignId],
    }) ?? [];
  return donateUserLength;
}
export function useGetCampaignUserList(campaignId: any) {
  const [donateUserList]: any =
    useContractCall({
      abi: campaignContractInterface,
      address: campaignContractAddress,
      method: "getCampaignUserList",
      args: [campaignId],
    }) ?? [];
  return donateUserList;
}

export function useGetCampaignUserInfo(campaignId: any, address: any) {
  const [userinfo]: any =
    useContractCall({
      abi: campaignContractInterface,
      address: campaignContractAddress,
      method: "getCampaignUserInfo",
      args: [campaignId, address],
    }) ?? [];
  return userinfo;
}

export function useGetCampaignDonateduser(address: any) {
  const [campaignIdList]: any =
    useContractCall({
      abi: campaignContractInterface,
      address: campaignContractAddress,
      method: "getCampaignDonateduser",
      args: [address],
    }) ?? [];
  return campaignIdList;
}

export function useContractMethod(methodName: string) {
  const { state, send } = useContractFunction(contract, methodName, 3);
  return { state, send };
}

export function useDonateTocampaign() {
  const { state, send } = useContractFunction(contract, "donateTocampaign", 3);
  return { state, send };
}
