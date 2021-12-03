import { Box, Text, Link, Flex } from "@chakra-ui/layout";
import { Link as reactLink } from "react-router-dom";
import { formatUnits } from "@ethersproject/units";
import { useCampaignState, useGetCampaignInfo } from "../../hooks/campaigns";
import { Progress, Skeleton } from "@chakra-ui/react";
import CurrentMoney from "./CurrentMoney";
import { useBlockNumber } from "@usedapp/core";
import { useGetGroupInfoFromAddress } from "../../hooks/groups";
import CampaignTestImage from "./CampaignTestImage";

export default function CampaignEndedCard({campaignId}: any) {
    const campaign = useGetCampaignInfo(campaignId);
    const campaignState = useCampaignState(campaignId);
    const groupInfo = useGetGroupInfoFromAddress(!campaign? null : campaign.owner);
    const nowBlock = useBlockNumber();
    return (
        <>
        { 
            !campaignState ?
            <Link  
            as ={reactLink}
            to={`/campaignInfo?address=${!campaign? null : campaign.owner}&campaignId=${campaignId}`}
            background="white"
            borderRadius="md"
            shadow="md"
            w="305px"
            h="400px"
            minW="255px"
            my="5"
            mx="2"
            key={campaignId}
            borderColor="#875EFB"
            _hover={{
                backgroundColor: "#FFD9D9",
            }}
            _focus={{
                border: "2px",
                borderColor: "#875EFB"
            }}
        >
            <CampaignTestImage />
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
        </Link>    
        :<></>
        }
        </>
        )
}