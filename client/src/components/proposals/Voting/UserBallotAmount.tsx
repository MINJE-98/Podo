import { formatUnits } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
import { useGetCampaignUserInfo } from "../../../hooks/campaigns"

export default function UserBallotAmount({campaignId}: any) {
    const { account } = useEthers();
    const userinfo = useGetCampaignUserInfo(campaignId, account);
    return (
        <>
            {userinfo && formatUnits(userinfo.ballotAmount,0)}
        </>
    )
}