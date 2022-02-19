import {
    Box,
    Textarea,
    Flex,
    Text,
    Input,
    useToast,
    Button,
  } from "@chakra-ui/react";
import React, { useEffect } from "react";
import MainFlex from "../../components/boxs/MainFlex";
import PageTitle from "../../components/font/PageTitle";
import { useCreateGroupInfo } from "../../hooks/groups"
  
  export default function GroupCreate() {
    const toast = useToast();
    const [name, setName] = React.useState("")
    const [desc, setDesc] = React.useState("")
    const [category, setCategory] = React.useState("")
    const handleGroupName = (event: any): any => setName(event.target.value)
    const handleGroupDesc = (event: any): any => setDesc(event.target.value)
    const handleGroupCategory = (event: any): any => setCategory(event.target.value)
    const { state, send } = useCreateGroupInfo();
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

   function handleSetGroupInfo() {
        send(name, desc, 0)
      }
    return (
      <MainFlex>
        <Flex
            // justifyContent="center"
          justifyContent="flex-start"
        >
          <PageTitle text={"Create Group"} />
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
                      Group Name
                </Text>
                <Input mt="2" onChange={handleGroupName} border="0" backgroundColor="white" variant="outline" placeholder="그룹 명을 입력해주세요."/>
              </Box>
              <Box
                my="5"
              >
              <Text>
                      Group Desc
                </Text>
                <Textarea mt="2" onChange={handleGroupDesc} border="0" backgroundColor="white" h="200px" variant="outline" placeholder="그룹 설명을 입력해주세요."/>
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
                onClick={()=> handleSetGroupInfo()}
              >
                그룹 생성하기
            </Button>
          </Flex>
          </MainFlex>
    );
  }
  