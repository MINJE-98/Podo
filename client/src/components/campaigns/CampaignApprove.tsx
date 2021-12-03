import { Button, useToast, Alert, AlertIcon, Flex } from "@chakra-ui/react";
import { useContractMethod } from "../../hooks/podo";
import { useEffect } from "react";
import { campaignContractAddress } from "../../contracts";


export default function CampaignApprove() {
    const { state: approveState, send: sendApprove } = useContractMethod("approve");
    const toast = useToast();
    const approving = () =>{
        sendApprove(campaignContractAddress, '100000000000000000000000000000');
    }
    useEffect(()=>{
        if(approveState.status === "Mining") {
            toast({
                title: "트랜젝션 제출됨",
                position: "top-right",
                description: "트랜젝션이 제출되었습니다.",
                status: "info",
                duration: 9000,
                isClosable: true,
              })
        }
        if(approveState.status === "Success") {
            toast({
                title: "트랜젝션 제출 확인됨",
                position: "top-right",
                description: "트랜젝션 제출 확인되었습니다!",
                status: "success",
                duration: 9000,
                isClosable: true,
              })
        }
        if(approveState.status === "Fail") {
            toast({
                title: "트랜젝션 실패",
                position: "top-right",
                description: approveState.errorMessage,
                status: "error",
                duration: 9000,
                isClosable: true,
              })
        }
        if(approveState.status === "Exception") {
            toast({
                title: "트랜젝션 제출 실패",
                position: "top-right",
                description: approveState.errorMessage,
                status: "error",
                duration: 9000,
                isClosable: true,
              })
        }
    },[approveState])
    return (
        <>
            <Alert fontSize="13px" status="info">
                <AlertIcon />
                캠페인에 PODO를 기부하기전 컨트랙트를 승인을 해야합니다.
            </Alert>
               
            <Button
                w="100%"
                mt="4"
                backgroundColor="purple.500"
                color="white"
                isLoading={approveState && approveState.status === "Mining" ? true : false}
                onClick={approving}
                _focus={{
                    border:"0"
                }}
            >
                컨트랙트 승인
            </Button>
        </>
    )
}