import { Box, Flex } from "@chakra-ui/layout";
import { formatUnits } from "@ethersproject/units";
import MainFlex from "../../components/boxs/MainFlex";
import CampaignActiveCard from "../../components/campaigns/CampaignActiveCard";
import PageTitle from "../../components/font/PageTitle";
import { useGetCampaignLength } from "../../hooks/campaigns";

export default function Campaigns(){
    const campaignLength = useGetCampaignLength();
    var campaign = Array.from({length: campaignLength}, (v,i) => i);
    return(
        <MainFlex>
            <Flex
            flexDirection="column"
            flexWrap="wrap"
            >
                <PageTitle text={"Campaigns"} />
                {
                    campaign.map((v: any)=> <CampaignActiveCard campaignId={v} />)
                }
            </Flex>
        </MainFlex>
    )
}