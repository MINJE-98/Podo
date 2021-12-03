import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useExecuteProse } from "../../../hooks/proposals";

export default function ExecutePropose({proposalId, campaignId}: any) {
    const { state, send } = useExecuteProse();
    const executd = () =>{
        send(proposalId, campaignId)
    }
    const toast = useToast()
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
    return(
        <Button
        mt="4"
        backgroundColor="green.500"
        color="white"
        onClick={executd}
        >
            제안 실행하기
        </Button>
    )
}