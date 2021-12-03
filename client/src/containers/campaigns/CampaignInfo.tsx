import { Flex, Text, Box, Input, Link, Button, Skeleton, Progress } from "@chakra-ui/react";
import { useBlockNumber, useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import { formatUnits } from "ethers/lib/utils";
import React from "react";
import { Link as reactLink, useLocation } from "react-router-dom";
import MainFlex from "../../components/boxs/MainFlex";
import CampaignApprove from "../../components/campaigns/CampaignApprove";
import CampaignDonate from "../../components/campaigns/CampaignDonate";
import CampaignImage from "../../components/campaigns/CampaignImage";
import CurrentMoney from "../../components/campaigns/CurrentMoney";
import UserIdenticon from "../../components/campaigns/UserIdenticon";
import PageTitle from "../../components/font/PageTitle";
import PodoBalance from "../../components/header/PodoBalance";
import { campaignContractAddress, podoContractAddress } from "../../contracts";
import { useCampaignState, useGetCampaignInfo, useGetCampaignUserList } from "../../hooks/campaigns";
import { useGetGroupInfoFromAddress } from "../../hooks/groups";

export default function CampaignInfo() {
    const { account } = useEthers();
    const campaignId = useQuery().get("campaignId");
    const address = useQuery().get("address");
    const groupInfo = useGetGroupInfoFromAddress(address);
    const campaign = useGetCampaignInfo(campaignId);
    const campaignState = useCampaignState(campaignId);
    const userlist = useGetCampaignUserList(campaignId);
    const [amount, setAmount] = React.useState("")
    const nowBlock = useBlockNumber();
    const podobalance = useTokenBalance(podoContractAddress, account)
    function useQuery() {
        return new URLSearchParams(useLocation().search);
      }
    const handlePodoAmount = (event: any): any => setAmount(event.target.value);
    const allowance = useTokenAllowance(podoContractAddress, account, campaignContractAddress);
    return(
        <MainFlex>
        <Flex>
          <PageTitle text={"Campaign"} />
        </Flex>
            <Flex
              backgroundColor="#FAFAFA"
              flexDirection="row"
              p="24px"
            >
                <Flex flex="2" justifyContent="center" flexDirection="column">
                    <CampaignImage />
                    {!campaign ?  <Skeleton mt="20px" w="430px" h="280px" /> : 
                    <Text
                        mt="15px"
                        fontFamily="Poppins"
                        fontSize="15px"
                        fontWeight="500"
                        lineHeight="20px"
                        color="gray.400"
                    >{campaign.campaignDesc}</Text>}
                </Flex>
                <Flex flex="1" px="10px"  flexDirection="column">
                    <Text
                        fontFamily="Poppins"
                        fontSize="19px"
                        fontWeight="500"
                        lineHeight="20px"
                    >
                        {!campaign ? <Skeleton w="50px" h="30px" /> : campaign.campaignName}
                    </Text>
                    <Text
                        fontFamily="Poppins"
                        fontWeight="medium"
                        fontSize="15px"
                        color="blackAlpha.500"
                    >
                        <Link as={reactLink} to={`/groupInfo?address=${address}`} _focus={{ border:"0" }}>
                            {!groupInfo ? <Skeleton mt="2" w="30px" /> : groupInfo.name}
                        </Link>
                    </Text>
                    <Box
                        mt="10"
                    >
                        {!campaign ? <></> :  
                        <Text
                            fontFamily="Poppins"
                            fontSize="15px"
                            fontWeight="bold"
                            color="purple.500"
                        >{nowBlock && +formatUnits(campaign.endBlock,0) - nowBlock <= 0 ? <>Ended</>: nowBlock && +formatUnits(campaign.endBlock,0) - nowBlock + ' blocks'}</Text>
                        }
                    </Box>
                    {!campaign ? <Skeleton mt="2px" w="200px" h="2px"/> :
                    <Progress value={(+formatUnits(campaign.currentMoney,0)) / (+formatUnits(campaign.targetMoney,0)) * 100} size="xs" colorScheme="purple" />}
                    <Flex justifyContent="space-between">
                        {!campaign ? <Skeleton mt="2px" w="30px" h="15px"/>   :
                        <CurrentMoney currentmoney={+formatUnits(campaign.currentMoney,0)} />}
                        {!campaign ? <Skeleton mt="2px" w="30px" h="15px"/>   :
                        <CurrentMoney currentmoney={+formatUnits(campaign.targetMoney,0)} />}
                    </Flex>
                    <Flex
                        flexDirection="row"
                        backgroundColor="white"
                        borderRadius="xl"
                    >
                    {!userlist ? <></> : userlist.map((v:any)=><>
                    <UserIdenticon address={v} campaignId={campaignId} />
                    </>)}
                    </Flex>
                    <Flex
                        justifyContent="center"
                        alignItems="flex-end"
                        flexDirection="column"
                        backgroundColor="white"
                        p="5"
                        my="4"
                    >
                        <PodoBalance />
                        <Input onChange={handlePodoAmount} placeholder="0" border="0"  _focus={{ border:"0" }} w="sm"/>
                    </Flex>
                    <Flex
                        flexDirection="column"
                        alignItems="center"
                    >
                        {campaignState ? allowance && formatUnits(allowance,0) === '0' ? <CampaignApprove />
                        :  <CampaignDonate campaignId={campaignId} amount={amount} />
                        : 
                        <Button
                        w="100%"
                        mt="4"
                        backgroundColor="purple.500"
                        color="white"
                        disabled={true}
                        _focus={{
                            border:"0"
                        }}
                    >
                        모금 종료
                    </Button>
                        }
                    </Flex>
                </Flex>
          </Flex>
          <Flex
            justifyContent="center"
          >
          </Flex>
          </MainFlex>

// 기부자들 리스트
/* <Flex
flexDirection="row"
backgroundColor="white"
borderRadius="xl"
h="200px"
>

{!userlist ? <Skeleton borderRadius="2xl" m="1" w="30px" h="30px" /> : userlist.map((v:any)=><UserIdenticon address={v} />)}
</Flex> */
        // <Box
        //     display="flex"
        //     alignItems="center"
        //     justifyContent="center"
        //     mx={{ base: 20 }}
        // >
        //     <Flex
        //         flexDirection="row"
        //         backgroundColor="white"
        //         borderRadius="xl"
        //         p={{ base: 10 }}
        //     >
        //         <Flex
        //         flexDirection="column"
        //         w="xs"
        //         >
        //             <Box>
        //                 {campaign && campaign.campaignName}
        //             </Box>
        //             <Box>
        //                 {campaign && campaign.campaignDesc}
        //             </Box>
        //             {
        //                 userlist && userlist.map((v:any) => <CampaignDonateUserInfo address={v} campaignId={campaignId} />
        //                 )
        //             }
        //         </Flex>
        //         <Flex
        //             flexDirection="column"
        //         >
        //             <Box>
        //                     {campaign && formatUnits(campaign.startBlock,0)}
        //                 </Box>
        //                 <Box>
        //                     {campaign && formatUnits(campaign.endBlock,0)}
        //                 </Box>
        //                 <Box>
        //                     {campaign && formatUnits(campaign.targetMoney,0)}
        //                 </Box>
        //                 <Box>
        //                     {campaign && formatUnits(campaign.currentMoney,0)}
        //                 </Box>
        //                 <Box>
        //                     {campaignState && campaignState ? <>
        //                         <Text>모금 진행중</Text>
        //                         <CampaignDonate campaignId={campaignId} />
        //                     </>: <>
        //                         <Text>모금 종료</Text>
        //                         {campaign && campaign.owner === account
        //                          ? <ProposalCreateButton campaignId={campaignId} />
        //                          : <></>
        //                         }
        //                     </>}
        //                 </Box>
        //         </Flex>
        //     </Flex>
        // </Box>
    )
}