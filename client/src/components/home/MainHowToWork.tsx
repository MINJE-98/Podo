import { Text, Image, Flex } from "@chakra-ui/react";
import howtowork from "../../res/howtowork.png";
export default function MainHowToWork() {
    return (
        <>
            <Text
                fontFamily="Pretendard"
                fontSize="2xl"
                fontWeight="bold"
                my="4"
            >
                PODO의 동작 과정
            </Text>
            
            <Image src={howtowork} w="2xl" />
        </>
    )
}