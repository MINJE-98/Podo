import { useEffect, useRef } from "react";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";
import { Flex, Text } from "@chakra-ui/layout";
import { useGetCampaignUserInfo } from "../../hooks/campaigns";
import { formatUnits } from "ethers/lib/utils";

const StyledIdenticon = styled.div`
`;

export default function UserIdenticon({address, campaignId}:any) {
  const userinfo = useGetCampaignUserInfo(campaignId, address);
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(30, parseInt(address.slice(2, 10), 16)));
    }
  }, []);

  return (
    <Flex p="2" flexDirection="column" flexWrap="wrap">
      <StyledIdenticon ref={ref as any} />
      <Text
        fontSize="10px"
        fontWeight="semibold"
        color="purple.500"
        textAlign="center"
      >
        {userinfo && formatUnits(userinfo.donateAmount,0)}
      </Text>
    </Flex>
  )
}
