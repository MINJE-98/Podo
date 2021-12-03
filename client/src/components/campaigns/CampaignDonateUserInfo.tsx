import { Box, Flex } from "@chakra-ui/layout";
import { formatUnits } from "@ethersproject/units";
import { useGetCampaignUserInfo } from "../../hooks/campaigns";

export default function CampaignDonateUserInfo({campaignId, address}: any){
    const userinfo = useGetCampaignUserInfo(campaignId, address);
    return(
        <Box>
            <Flex>
                {`${address.slice(0, 6)}...${address.slice(
              address.length - 4,
              address.length
            )}`}
            </Flex>
                {userinfo && formatUnits(userinfo.donateAmount,0)}
        </Box>
    )   
}