import { Flex } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { formatUnits } from "ethers/lib/utils";
import MainFlex from "../../components/boxs/MainFlex";
import PageTitle from "../../components/font/PageTitle";
import CampaignCard from "../../components/proposals/CampaignCard";
import { useGetCampaignDonateduser, useGetCampaignsList } from "../../hooks/campaigns";

export default function Proposals(){
    const { account } = useEthers();
    const campaignList = useGetCampaignsList(account);
    const donatedcmapaign = useGetCampaignDonateduser(account);
    return(
        <MainFlex>
            <Flex
                flexDirection="column"
                flexWrap="wrap"
            >
            <PageTitle text={"My Proposals"} />
                {!campaignList ? <></> : campaignList.map((v: any)=> <CampaignCard campaignId={v} />)}
            <PageTitle text={"Donated Proposals"} />
                {!donatedcmapaign ? <></> : donatedcmapaign.map((v: any)=> <CampaignCard key={formatUnits(v,0)} campaignId={formatUnits(v,0)} />)}
            </Flex>
            <Flex>
            </Flex>
        </MainFlex>
    )
}

{/* <>
{campaignState && campaignState
? <Box>아직 모금이 진행중인 캠페인입니다.</Box>
:
<Box
display="flex"
alignItems="center"
justifyContent="center"
mx={{ base: 20 }}
>
<Flex
    flexDirection="row"
    backgroundColor="white"
    borderRadius="xl"
    p={{ base: 10 }}
>
    <Flex
    flexDirection="column"
    w="xs"
    >
        <Box>
            {campaign && campaign.campaignName}
        </Box>
        <Box>
            {campaign && campaign.campaignDesc}
        </Box>
        {
            userlist && userlist.map((v:any) => <CampaignDonateUserInfo address={v} campaignId={campaignId} />
            )
        }
    </Flex>
    <Flex
        flexDirection="column"
    >
        <Box>
                {campaign && formatUnits(campaign.startBlock,0)}
            </Box>
            <Box>
                {campaign && formatUnits(campaign.endBlock,0)}
            </Box>
            <Box>
                {campaign && formatUnits(campaign.targetMoney,0)}
            </Box>
            <Box>
                {campaign && formatUnits(campaign.currentMoney,0)}
            </Box>
    </Flex>
</Flex>
        <ProposalLists campaignId={campaignId} />
</Box>
}
</> */}