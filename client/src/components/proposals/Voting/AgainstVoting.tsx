import { Button, useToast } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { useEffect } from "react";
import { useCastVote } from "../../../hooks/proposals";
export default function AgainstVoting({campaignId, proposalId, amount, reason}: any){
    const toast = useToast()
    const { account } = useEthers();
    const { state, send } = useCastVote();
    const castVoting = () =>{
        send(account, campaignId, proposalId, amount, reason, false);
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
    return(
        <Button
            px="10"
            backgroundColor="red.500"
            color="white"
            _focus={{
                border:"0"
            }}
            hover={{
                backgroundColor:"red.500"
            }}
            _active={{
                backgroundColor:"red.500"
            }}
            onClick={castVoting}
        >
            반대
        </Button>
    )
}