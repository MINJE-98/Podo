import { Box, Button, Input, useToast, Flex } from "@chakra-ui/react";
import PodoBalance from "../header/PodoBalance";
import { useDonateTocampaign } from "../../hooks/campaigns";
import { useEffect } from "react";
import React from "react";


export default function CampaignDonate({campaignId, amount}: any) {
    const { state: donatetocampaignState, send: sendDonatetocampaign } = useDonateTocampaign();
    const toast = useToast();
    
    const donate = () =>{
        sendDonatetocampaign(campaignId, amount);
    }
    useEffect(()=>{
        if(donatetocampaignState.status === "Mining") {
            toast({
                title: "트랜젝션 제출됨",
                position: "top-right",
                description: "트랜젝션이 제출되었습니다.",
                status: "info",
                duration: 9000,
                isClosable: true,
              })
        }
        if(donatetocampaignState.status === "Success") {
            toast({
                title: "트랜젝션 제출 확인됨",
                position: "top-right",
                description: "트랜젝션 제출 확인되었습니다!",
                status: "success",
                duration: 9000,
                isClosable: true,
              })
        }
        if(donatetocampaignState.status === "Fail") {
            toast({
                title: "트랜젝션 실패",
                position: "top-right",
                description: donatetocampaignState.errorMessage,
                status: "error",
                duration: 9000,
                isClosable: true,
              })
        }
        if(donatetocampaignState.status === "Exception") {
            toast({
                title: "트랜젝션 제출 실패",
                position: "top-right",
                description: donatetocampaignState.errorMessage,
                status: "error",
                duration: 9000,
                isClosable: true,
              })
        }
    },[donatetocampaignState])
    return (                  
            <Button
            w="100%"
            mt="4"
            backgroundColor="purple.500"
            color="white"
            isLoading={donatetocampaignState && donatetocampaignState.status === "Mining" ? true : false}
            onClick={donate}
            _focus={{
                border:"0"
            }}
            >
                포도 기부
            </Button>
    )
}