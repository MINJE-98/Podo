import { Flex, Image, Text, useBreakpointValue, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../../res/PODO.png"

export default function Logo() {
  return (
  <Link to="/podoo">
    <Flex
      flex="1"
      justifyContent="center"
      alignItems="center"
    >
      <Image src={logo}  height="2rem" width="2rem"/>
      <Text
        mx="3"
        fontSize="xl"
        fontWeight="bold"
        color="purple.500"
        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
        fontFamily={'heading'}>
        PODO
        </Text>
    </Flex>
  </Link>
  )

}
