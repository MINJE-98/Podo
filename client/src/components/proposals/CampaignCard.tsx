import { Box, Text, Link, Flex } from "@chakra-ui/layout";
import { Link as reactLink } from "react-router-dom";
import { formatUnits } from "@ethersproject/units";
import { useCampaignState, useGetCampaignInfo } from "../../hooks/campaigns";
import { Progress, Skeleton } from "@chakra-ui/react";
import { useBlockNumber, useEthers } from "@usedapp/core";
import { useGetGroupInfoFromAddress } from "../../hooks/groups";
import CurrentMoney from "../campaigns/CurrentMoney";
import ProposalImage from "./ProposalImage";
import ProposalSampleInfo from "./ProposalSampleInfo";
import { useGetProposalLength } from "../../hooks/proposals";
import ProposalCreateButton from "./ProposalCreateButton";

export default function CampaignCard({campaignId}: any) {
    const { account } = useEthers();
    const campaign = useGetCampaignInfo(campaignId);
    const campaignState = useCampaignState(campaignId);
    const groupInfo = useGetGroupInfoFromAddress(!campaign? null : campaign.owner);
    const nowBlock = useBlockNumber();
    const proposalLength = useGetProposalLength(campaignId);
    var proposalId = Array.from({length: proposalLength}, (v,i) => i);
    return (
        <>
        {
            !campaignState ?
        <Flex
            flexDirection="column"
            w="100%"
            minW="400px"
        >
        <Flex
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Text
                fontFamily="Poppins"
                fontSize="20px"
                fontWeight="500"
                color="gray.400"
            >{!campaign ? null : campaign.campaignName}</Text>
            {!campaign ? <></> : account === campaign.owner ? <ProposalCreateButton campaignId={campaignId} /> : <></>}
        </Flex>
        <Flex  
            flexDirection="row"
            background="white"
            borderRadius="md"
            shadow="md"
            minW="255px"
            my="5"
            mx="2"
            key={campaignId}
            borderColor="#875EFB"
        >
            <Flex
                flex="1"
                flexDirection="column"
            >
            <ProposalImage />
            <Flex
                p="15px"
                flexDirection="column"
            >
                <Text
                    fontFamily="Poppins"
                    fontWeight="medium"
                    fontSize="xl"
                >
                    {!campaign ? <Skeleton w="50px" h="30px" /> : campaign.campaignName}
                </Text>
                <Text
                    fontFamily="Poppins"
                    fontWeight="medium"
                    fontSize="15px"
                    color="blackAlpha.500"
                >
                    {!groupInfo ? <Skeleton mt="2" w="30px" /> : groupInfo.name}
                </Text>
                <Text
                        fontFamily="Poppins"
                        fontSize="15px"
                        fontWeight="500"
                        color="gray.400"
                        h="100px"
                >
                    {!campaign ? <Skeleton mt="10px" w="200px" h="110px" />:  campaign.campaignDesc.length <= 68 ? campaign.campaignDesc : campaign.campaignDesc.substring(0,68) + "..."}
                </Text>
                <Box>
                {!campaign ? <></> :  
                    <Text
                        fontFamily="Poppins"
                        fontSize="15px"
                        fontWeight="bold"
                        color="purple.500"
                    >{nowBlock && +formatUnits(campaign.endBlock,0) - nowBlock <= 0 ? <>Ended</>: nowBlock && +formatUnits(campaign.endBlock,0) - nowBlock  + ' blocks'}</Text>
                    }
                </Box>
                {!campaign ? <Skeleton mt="2px" w="200px" h="2px"/> :
                <Progress value={(+formatUnits(campaign.currentMoney,0)) / (+formatUnits(campaign.targetMoney,0)) * 100} size="xs" colorScheme="purple" />}
                {!campaign ? <Skeleton mt="2px" w="30px" h="15px"/>   :
                <CurrentMoney currentmoney={+formatUnits(campaign.currentMoney,0)} />}
            </Flex>
            </Flex>
            <Flex
                flex="1"
                p="15px"
                flexDirection="column"
            >
                {proposalId.map((v:any)=> <ProposalSampleInfo key={v} proposalId={v} campaignId={campaignId} /> )}
            </Flex>
        </Flex>    
        </Flex>
        :<></>
        }
        </>
        )
}