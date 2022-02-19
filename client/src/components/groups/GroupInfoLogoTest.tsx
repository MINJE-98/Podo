import { Flex, Image, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../../res/PODO.png"

export default function GroupInfoLogoTest() {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
    >
      <Image src={logo}  height="4rem" width="4rem"/>
      <Text
        mx="3"
        fontSize="4xl"
        fontWeight="bold"
        color="purple.500"
        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
        fontFamily={'heading'}>
        PODO
        </Text>
    </Flex>
  )

}
