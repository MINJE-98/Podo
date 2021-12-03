import { Box, Button, Flex, Input, useToast, Text, Textarea } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useContractMethod } from "../../hooks/campaigns";
import { useEthers } from "@usedapp/core"
import MainFlex from "../../components/boxs/MainFlex";
import PageTitle from "../../components/font/PageTitle";

export default function CampaignCreate() {
    const { state, send } = useContractMethod("createCampaign");
    const toast = useToast()
    const createCampaign = () =>{
        send(name, desc, targetMoney, 0, endBlock);
    }
    useEffect(()=>{
        if(state.status === "Mining") {
            toast({
                title: "트랜젝션 제출됨",
                position: "top-right",
                description: "트랜젝션이 제출되었습니다.",
                status: "info",
                duration: 9000,
                isClosable: true,
              })
        }
        if(state.status === "Success") {
            toast({
                title: "트랜젝션 제출 확인됨",
                position: "top-right",
                description: "트랜젝션 제출 확인되었습니다!",
                status: "success",
                duration: 9000,
                isClosable: true,
              })
        }
        if(state.status === "Fail") {
            toast({
                title: "트랜젝션 실패",
                position: "top-right",
                description: state.errorMessage,
                status: "error",
                duration: 9000,
                isClosable: true,
              })
        }
        if(state.status === "Exception") {
            toast({
                title: "트랜젝션 제출 실패",
                position: "top-right",
                description: state.errorMessage,
                status: "error",
                duration: 9000,
                isClosable: true,
              })
        }
    },[state])
    const [name, setName] = React.useState("")
    const [desc, setDesc] = React.useState("")
    const [startBlock, setStartBlock] = React.useState("")
    const [endBlock, setEndBlock] = React.useState("")
    const [targetMoney, setTargetMoney] = React.useState("")
    const handleCampaignName = (event: any): any => setName(event.target.value)
    const handleCampaignDesc = (event: any): any => setDesc(event.target.value)
    const handleCampaignStartBlock = (event: any): any => setStartBlock(event.target.value)
    const handleCampaignEndBlock = (event: any): any => setEndBlock(event.target.value)
    const handleCampaignTargetMoney = (event: any): any => setTargetMoney(event.target.value)
    return (
        <MainFlex>
        <Flex
            // justifyContent="center"
          justifyContent="flex-start"
        >
          <PageTitle text={"Create Campaign"} />
        </Flex>
            <Flex
              minW="250"
              backgroundColor="#FAFAFA"
              flexDirection="column"
              p="24px"
            >
              <Box
              >
                <Text>
                    Campaign Name
                </Text>
                <Input mt="2" onChange={handleCampaignName} border="0" backgroundColor="white" variant="outline" placeholder="캠페인 명을 입력해주세요."/>
              </Box>
              <Box
                mt="5"
              >
                <Text>
                    Campaign Period
                </Text>
                <Input mt="2" onChange={handleCampaignEndBlock} border="0" backgroundColor="white" variant="outline" placeholder="캠페인 종료 블럭을 입력해주세요."/>
              </Box>
              <Box
                mt="5"
              >
                <Text>
                    Campaign ProposeAmount
                </Text>
                <Input mt="2" onChange={handleCampaignTargetMoney} border="0" backgroundColor="white" variant="outline" placeholder="캠페인 제안 금액을 입력해주세요."/>
              </Box>
              <Box
                mt="5"
              >
              <Text>
                Campaign Desc
                </Text>
                <Textarea mt="2" onChange={handleCampaignDesc} border="0" backgroundColor="white" h="200px" variant="outline" placeholder="캠페인 설명을 입력해주세요."/>
              </Box>
          </Flex>
          <Flex
            justifyContent="center"
          >
          <Button
            minW="150"
                mt={{base: 5}}
                isLoading={state.status === "Mining" ? true : false}
                backgroundColor="purple.500"
                color="white"
                borderRadius="2px"
                _focus={{
                    border: "0"
                }}
                onClick={()=> createCampaign()}
              >
                캠페인 생성하기
            </Button>
          </Flex>
          </MainFlex>
    )
}