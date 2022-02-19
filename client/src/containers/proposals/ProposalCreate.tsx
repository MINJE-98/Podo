import { Box, Button, Flex, Input, useToast, Text, Textarea } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainFlex from "../../components/boxs/MainFlex";
import PageTitle from "../../components/font/PageTitle";
import { useCreateProposal } from "../../hooks/proposals";

// uint256 _campaignId,
// uint256 _proposeAmount,
// string memory _title,
// string memory _desc

export default function ProposalCreate() {
    const { state, send } = useCreateProposal();
    const campaignId = useQuery().get("campaignId");
    const toast = useToast()
    function useQuery() {
        return new URLSearchParams(useLocation().search);
      }
    const createCampaign = () =>{
        send(campaignId, proposeAmount, name, desc);
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
    const [proposeAmount, setProposeAmount] = React.useState("")
    const handleProposeName = (event: any): any => setName(event.target.value)
    const handleProposeDesc = (event: any): any => setDesc(event.target.value)
    const handleProposeAmount = (event: any): any => setProposeAmount(event.target.value)
    return (
        <MainFlex>
        <Flex
          justifyContent="flex-start"
        >
          <PageTitle text={"Create Propose"} />
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
                      Propose Name
                </Text>
                <Input mt="2" onChange={handleProposeName} border="0" backgroundColor="white" variant="outline" placeholder="제안 명을 입력해주세요."/>
              </Box>
              <Box
                my="5"
              >
              <Text>
                      Propose Desc
                </Text>
                <Textarea mt="2" onChange={handleProposeDesc} border="0" backgroundColor="white" h="200px" variant="outline" placeholder="제안 설명을 입력해주세요."/>
              </Box>
              <Box
                my="5"
              >
              <Text>
                      Propose Amount
                </Text>
                <Input mt="2" onChange={handleProposeAmount} border="0" backgroundColor="white" variant="outline" placeholder="제안 금액을 입력해주세요."/>
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
                onClick={createCampaign}
              >
                제안서 작성하기
            </Button>
          </Flex>
          </MainFlex>
    )
}