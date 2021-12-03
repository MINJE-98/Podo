import { Flex } from "@chakra-ui/layout";
import { useEthers } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { useGetCampaignDonateduser, useGetCampaignsList } from "../../hooks/campaigns";
import Campaign from "./Campaign";
import MainFlex from "../boxs/MainFlex";
import PageTitle from "../font/PageTitle";

export default function DonateCampaignList() {
    const { account } = useEthers();
    const donatedcmapaign = useGetCampaignDonateduser(account);
    const mycampaign = useGetCampaignsList(account);
    return(
        <MainFlex>
                <PageTitle text="My Campaigns" />
            <Flex
                flexWrap="wrap"
            >
                    {mycampaign && mycampaign.map((v: any)=> <Campaign key={formatUnits(v,0)} campaignId={formatUnits(v,0)} />
                    )}
            </Flex>
                <PageTitle text="Donated Campaigns" />
            <Flex
                flexWrap="wrap"
                >
                    {donatedcmapaign && donatedcmapaign.map((v:any)=><Campaign  key={formatUnits(v,0)} campaignId={formatUnits(v,0)} />)}
            </Flex>
        </MainFlex>
    )
}