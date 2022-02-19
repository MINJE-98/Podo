import { Button, Box, Text, Image, Skeleton, Flex, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, useToast } from "@chakra-ui/react";
import { podoContractAddress } from "../../contracts"
import { useEthers, useTokenBalance } from "@usedapp/core";
import { formatUnits } from '@ethersproject/units'
import podo from "../../res/PODO.png"
import { useEffect } from "react";
import { useMint } from "../../hooks/podo";
import { Link } from "@reach/router";

export default function PodoBalance() {
    const toast = useToast();
    const { account } = useEthers();
    const podobalance = useTokenBalance(podoContractAddress, account)
    const { state, send } = useMint();
    const getPodo = () =>{
        send(account, 100)
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
    return (
            <Popover>
            <PopoverTrigger>
                <Flex
                    cursor="pointer"
                    alignItems="center"
                    justifyContent="center"
                    mx="10px"
                    display={{ base: 'none', md: 'flex' }}
                >
                <Image src={podo} height="2rem" width="2rem" />
                <Text 
                    color="purple.500"
                    fontSize="rm"
                    fontWeight="semibold"
                    marginLeft="2"
                >
                    {!podobalance ? <Skeleton w="50px" h="30px" />: <Text>{formatUnits(podobalance, 0)}</Text>}
                </Text>
                </Flex>
            </PopoverTrigger>
            <PopoverContent
                w="100%"
                h="100%"
            >
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>무료 포도받기!</PopoverHeader>
                <PopoverBody>
                    <Button
                        px="10"
                        backgroundColor="purple.500"
                        color="white"
                        onClick={getPodo}
                    >
                        주세요!
                    </Button>
                </PopoverBody>
            </PopoverContent>
            </Popover>
    );
}