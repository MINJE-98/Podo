import { Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import PODO from "../../res/PODO.png"
export default function CurrentMoney({ currentmoney }:any) {
    return(
        <Flex
        alignItems="center"
        >
            <Image src={PODO} w="1rem" h="1rem"/>
            <Text
                fontSize="15px"
                fontWeight="bold"
                color="purple.500"
                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                fontFamily={'heading'}>
                {currentmoney}
            </Text>
        </Flex>
    )
}