import { Flex, Image } from "@chakra-ui/react";
import background from "../../res/background.jpeg"

export default function CampaignTestImage() {
  return (
    <Flex
      flex="1"
      justifyContent="center"
    >
      <Image src={background}  height="180px"   w="305px" borderRadius="md" />
    </Flex>
  )

}
