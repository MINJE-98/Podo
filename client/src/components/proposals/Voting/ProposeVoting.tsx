import { Input, Box, Flex, Textarea, Text, Alert, AlertIcon } from "@chakra-ui/react";
import React from "react";
import { useProposalState } from "../../../hooks/proposals";
import AgainstVoting from "./AgainstVoting";
import ExecutePropose from "./ExecutePropose";
import ForVoting from "./ForVoting";
import UserBallotAmount from "./UserBallotAmount";

export default function ProposeVoting({proposalId, campaignId}: any){
    const [reason, setReason] = React.useState("")
    const [amount, setAmount] = React.useState("")
    const handleReason = (event: any): any => setReason(event.target.value)
    const handleAmount = (event: any): any => setAmount(event.target.value)
    const proposalState = useProposalState(campaignId, proposalId);
    return (
            <Flex
                flexDirection="column"
                w="100%"
            >
                {proposalState === 0 ?
                <>
                <Text
                    fontFamily="Poppins"
                    fontSize="13px"
                    fontWeight="semibold"
                    color="gray.400"
                    textAlign="right"
                >
                    보유중인 투표권: <UserBallotAmount campaignId={campaignId} />
                </Text>
                <Text
                    fontFamily="Poppins"
                    fontSize="15px"
                    fontWeight="semibold"
                    color="blackAlpha.800"
                >
                    Use Ballot
                </Text>
                    <Input onChange={handleAmount} border="0" placeholder="0" color="blackAlpha.800" fontWeight="semibold"  />
                <Text
                    fontFamily="Poppins"
                    fontSize="15px"
                    fontWeight="semibold"
                    color="blackAlpha.800"
                >
                    Reason
                </Text>
                    <Textarea onChange={handleReason} border="0"  color="blackAlpha.800" fontWeight="semibold"  placeholder="투표 사유를 작성해주세요"  />
                    <Flex
                    mt="4"
                        justifyContent="space-evenly"
                    >
                        <ForVoting campaignId={campaignId} proposalId={proposalId} amount={amount} reason={reason}/>
                        <AgainstVoting campaignId={campaignId} proposalId={proposalId} amount={amount} reason={reason}/>
                    </Flex>
                </>
                : proposalState && proposalState === 1 ? 
                <Alert status="error">
                    <AlertIcon />
                    제안서 작성자가 취소하였습니다.
                </Alert>                     
                : proposalState && proposalState === 2 ? 
                  <Alert status="error">
                    <AlertIcon />
                    패배하였습니다. 제안서를 다시 작성해주세요.
                </Alert>               
                : proposalState && proposalState === 3 ? <>
                  <Alert status="info">
                    <AlertIcon />
                    승리하였습니다. 아래의 버튼을 통해 제안한 금액을 받으세요!
                </Alert>
                <ExecutePropose campaignId={campaignId} proposalId={proposalId} /></>
                : proposalState && proposalState === 4 ? 
                <Alert status="success">
                    <AlertIcon />
                    이미 제안한 금액을 수령하였습니다.
                </Alert>
                : proposalState && proposalState === 5 ? 
                <Alert status="warning">
                    <AlertIcon />
                    대기중입니다. 잠시만 기다려 주세요!
                </Alert>
                : <>로딩중..</>
                }
            </Flex>
    )
}