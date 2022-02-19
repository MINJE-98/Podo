import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useGetProposalInfo, useProposalState } from "../../hooks/proposals";
import transferProposalState from "../../utils/transferProposalState";

export default function ProposalSampleInfo({proposalId, campaignId}: any){
    const proposalInfo = useGetProposalInfo(proposalId, campaignId);
    const proposalState = useProposalState(campaignId, proposalId);
    const StateBox = ({color, text}: any) =>(
        <Box 
        backgroundColor={color}
        borderRadius="md"
        pt="4px"
        px="10px"
        pb="2px"
    >
        <Text
            fontFamily="Poppins"
            fontWeight="medium"
            fontSize="12px"
            color="white"
            textAlign="center"
        >
            {text}
        </Text>
    </Box>
    )
    return (
        <Link to={`/proposalInfo?campaignId=${campaignId}&proposalId=${[proposalId]}`}>
            <Flex
                flexDirection="row"
                backgroundColor="gray.200"
                borderRadius="md"
                alignItems="center"
                justifyContent="space-between"
                px="2"
                py="1"
                mb="1"
            >
            <Flex>
                <Text
                    fontFamily="Poppins"
                    fontWeight="medium"
                    fontSize="15px"
                    color="black"
                >
                {!proposalInfo ? <></> :  proposalInfo.proposalTitle}
                </Text>
            </Flex>
            <Flex>
                {transferProposalState(proposalState) === "진행중" ? <StateBox color="purple.500" text="진행중"/>
                    : transferProposalState(proposalState) === "취소" ? <StateBox color="tomato" text="취소됨"/>
                    : transferProposalState(proposalState) === "패배" ? <StateBox color="red.500" text="패배"/>
                    : transferProposalState(proposalState) === "승리" ? <StateBox color="blue.500" text="승리"/>
                    : transferProposalState(proposalState) === "실행" ? <StateBox color="green.500" text="실행됨"/>
                    : transferProposalState(proposalState) === "대기중" ? <StateBox color="gray.500" text="대기중"/>
                    : <StateBox color="#000" text="알쉆음"/>
                }
            </Flex>
            </Flex>
            </Link>
    )
}