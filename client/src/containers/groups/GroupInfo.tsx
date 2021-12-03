import { Flex, Text } from "@chakra-ui/layout";
import { useLocation } from "react-router-dom";
import CreateButton from "../../components/campaigns/CreateButton";
import { useGetGroupInfoFromAddress } from "../../hooks/groups";
import { useGetCampaignsList } from "../../hooks/campaigns";
import { formatUnits } from '@ethersproject/units'
import CampaignActiveCard from "../../components/campaigns/CampaignActiveCard";
import { useEthers } from "@usedapp/core";
import MainFlex from "../../components/boxs/MainFlex";
import GroupInfoLogoTest from "../../components/groups/GroupInfoLogoTest";
import CampaignEndedCard from "../../components/campaigns/CampaignEndedCard";

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
export default function GroupInfo() {
    let query = useQuery();
    const groupInfo = useGetGroupInfoFromAddress(query.get("address"));
    const { account } = useEthers();
    const campaignList = useGetCampaignsList(query.get("address"));
    return(
        <MainFlex>
            <Flex
                flexDirection="column"
                alignItems="center"
            >
                <GroupInfoLogoTest />
                <Text
                    fontFamily="Poppins"
                    fontSize="30px"
                    fontWeight="500"
                    lineHeight="58px"
                    letterSpacing="-0.9px"
                    color="#0B254B"
                >
                    {groupInfo && groupInfo.name}
                </Text>
                <Text
                    fontFamily="Poppins"
                    fontSize="15px"
                    fontWeight="500"
                    lineHeight="20px"
                    color="gray.400"
                >
                    {groupInfo && groupInfo.desc}
                </Text>
            </Flex>
            <Flex
                justifyContent="flex-end"
            >
                    {account === query.get("address") ? <CreateButton /> : <></>}
                </Flex>
            <Flex
                flexDirection="column"
                flexWrap="wrap"
          >
                <Text
                    fontFamily="Poppins"
                    fontSize="30px"
                    fontWeight="500"
                    lineHeight="58px"
                    letterSpacing="-0.9px"
                    color="#0B254B"
                >
                    Active Campaigns
                </Text>
                <Flex
                    flexDirection="row"
                    flexWrap="wrap"
                    justifyContent="flex-start"
                >
                    {campaignList && campaignList.map((v: any)=> <CampaignActiveCard key={formatUnits(v,0)} campaignId={formatUnits(v,0)} />
                    )}
            </Flex>
              <Text
                    fontFamily="Poppins"
                    fontSize="30px"
                    fontWeight="500"
                    lineHeight="58px"
                    letterSpacing="-0.9px"
                    color="gray.400"
              >
                  Ended Campaigns
                </Text>
            <Flex
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="flex-start"
            >
                {campaignList && campaignList.map((v: any)=> <CampaignEndedCard key={formatUnits(v,0)}  campaignId={formatUnits(v,0)} />
                )}
            </Flex>
            </Flex>
        </MainFlex>
        // <Box
        //     display="flex"
        //     alignItems="center"
        //     justifyContent="center"
        // >
        // <Flex
        //     flexDirection="column"
        //     m="10"
        // >
        //     <Flex
        //         justifyContent="space-around">
        //         <Flex>
        //             {console.log(groupInfo)}
        //             <Box>
        //                 {groupInfo && transferCategory(groupInfo.category) }
        //             </Box>
        //             <Box>
        //                 {groupInfo && groupInfo.name}
        //             </Box>
        //             <Box>
        //                 {groupInfo && groupInfo.desc}
        //             </Box>
        //         </Flex>

        //     </Flex>
        
        // </Flex>
        // </Box>
    )
}