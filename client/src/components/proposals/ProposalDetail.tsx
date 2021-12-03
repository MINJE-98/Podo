import { Image, Flex, Text, Box, Spacer, Progress } from "@chakra-ui/react";
import { formatUnits } from "@ethersproject/units";
import { useGetProposalInfo, useProposalState } from "../../hooks/proposals";
import transferProposalState from "../../utils/transferProposalState";
import ImageCrad from "../../res/proposal.jpeg"
import { useBlockNumber } from "@usedapp/core";
import ProposeVoting from "./Voting/ProposeVoting";
import Logo from "./Logo";

export  function ProposalDetail({proposalId, campaignId}: any){
    const proposalInfo = useGetProposalInfo(proposalId, campaignId);
    const proposalState = useProposalState(campaignId, proposalId);
    const nowBlock = useBlockNumber();
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
        <Flex
            flexDirection="row"

            borderRadius="md"
            minW="255px"
            my="5"
            mx="2"
            backgroundColor="#FAFAFA"
        >
            <Flex flex="1">
                <Image src={ImageCrad} />
            </Flex>
            <Flex flexDirection="column"  flex="1" px="4" py="2">
                    <Flex flexDirection="row" flex="1">
                        <Flex  justifyContent="flex-start" alignItems="center">
                            <Text
                                fontFamily="Poppins"
                                fontSize="20px"
                                fontWeight="bold"
                            >
                                {!proposalInfo ? <></> : proposalInfo.proposalTitle}
                            </Text>
                        </Flex>
                        <Spacer />
                    <Flex justifyContent="flex-end" alignItems="center">
                        {!proposalInfo ? <></> :  
                            <Text
                                mr="1"
                                fontFamily="Poppins"
                                fontSize="15px"
                                fontWeight="bold"
                                color="purple.500"
                            >{nowBlock && +formatUnits(proposalInfo.voteEnd,0) - nowBlock <= 0 ? <></>: nowBlock && +formatUnits(proposalInfo.voteEnd,0) - nowBlock + ' blocks'}</Text>
                            }
                        {transferProposalState(proposalState) === "진행중" ? <StateBox color="purple.500" text="진행중"/>
                        : transferProposalState(proposalState) === "취소" ? <StateBox color="tomato" text="취소됨"/>
                        : transferProposalState(proposalState) === "패배" ? <StateBox color="red.500" text="패배"/>
                        : transferProposalState(proposalState) === "승리" ? <StateBox color="blue.500" text="승리"/>
                        : transferProposalState(proposalState) === "실행" ? <StateBox color="green.500" text="실행됨"/>
                        : transferProposalState(proposalState) === "대기중" ? <StateBox color="gray.500" text="대기중"/>
                        : <StateBox color="#000" text="알쉆음"/>}
                    </Flex>
                    </Flex>
                    <Flex flex="2" flexDirection="column">
                    <Flex>
                        <Logo />
                            <Text
                                fontFamily="Poppins"
                                fontSize="15px"
                                fontWeight="extrabold"
                                color="purple.500"
                            >
                                {!proposalInfo ? <></> : formatUnits(proposalInfo.proposeAmount,0)}
                            </Text>
                        </Flex>
                        <Flex>
                            <Text
                                fontFamily="Poppins"
                                fontSize="15px"
                                fontWeight="semibold"
                                color="gray.500"
                            >
                                {!proposalInfo ? <></> : proposalInfo.proposalDesc}
                            </Text>
                        </Flex>
                        <Flex
                            flexDirection="row"
                            justifyContent="space-between"
                        >
                            <Text
                                fontFamily="Poppins"
                                fontSize="13px"
                                fontWeight="semibold"
                                color="green.500"
                            >
                                {!proposalInfo ? <></> : formatUnits(proposalInfo.forVotes,0) === "0" ? 0 : 
                                 +formatUnits(proposalInfo.forVotes,0) / (+formatUnits(proposalInfo.againstVotes,0) + +formatUnits(proposalInfo.forVotes,0))  * 100}%
                            </Text>
                            <Text
                                fontFamily="Poppins"
                                fontSize="13px"
                                fontWeight="semibold"
                                color="red.500"
                            >
                            {!proposalInfo ? <></> : formatUnits(proposalInfo.againstVotes,0) === "0" ? 0 : 
                                +formatUnits(proposalInfo.againstVotes,0) / (+formatUnits(proposalInfo.againstVotes,0) + +formatUnits(proposalInfo.forVotes,0)) * 100}%
                            </Text>
                        </Flex>
                            {
                                !proposalInfo ? 0
                                : (+formatUnits(proposalInfo.againstVotes,0) + +formatUnits(proposalInfo.forVotes,0)) === 0 ?
                                <Progress value={0} size="xs" backgroundColor="gray.500" />
                                :
                                <Progress value={+formatUnits(proposalInfo.forVotes,0) /(+formatUnits(proposalInfo.againstVotes,0) + +formatUnits(proposalInfo.forVotes,0)) * 100} colorScheme="green" size="xs" backgroundColor="red.500" />
                            }
                    <Flex
                    flexDirection="row"
                    justifyContent="space-between"
                    >
                        <Text
                            fontFamily="Poppins"
                            fontSize="13px"
                            fontWeight="semibold"
                            color="green.500"
                        >찬성</Text>
                        <Text
                            fontFamily="Poppins"
                            fontSize="13px"
                            fontWeight="semibold"
                            color="red.500"
                        >반대</Text>
                    </Flex>
                    <Flex
                        backgroundColor="white"
                        p="5"
                        borderRadius="md"
                        mt="5"
                    >
                        <ProposeVoting campaignId={campaignId} proposalId={proposalId}/>
                    </Flex>
                    </Flex>
            </Flex>
        </Flex>
    )
}