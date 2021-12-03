import { Flex, Image } from "@chakra-ui/react";
import background from "../../res/background.jpeg"

export default function ProposalImage() {
  return (
    <Flex
      flex="1"
      justifyContent="flex-start"
    >
      <Image src={background}  height="100%"  w="100%" borderRadius="md" />
    </Flex>
  )

}
