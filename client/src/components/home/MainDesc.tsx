import { Text } from "@chakra-ui/react";
export default function MainDesc() {
    return (
        <>
            <Text
                fontFamily="Pretendard"
                fontSize="3xl"
                fontWeight="bold"
                my="4"
            >
                블록체인 기반 참여형 기부 플랫폼 PODO
            </Text>
            <Text
                fontFamily="Pretendard"
                fontWeight="bold"
                fontSize="xs"
            >
                PODO는 기존 기부방식과 달리 기부만 하고 끝이 아닌 기부자들도 캠페인에 참여 할 수 있는 플랫폼입니다.
            </Text>
            <Text
                fontFamily="Pretendard"
                fontWeight="bold"
                fontSize="xs"
            >
                캠페인에 기부하여 캠페인의 모금 금액이 어떻게 사용되는지 확인해보세요!
            </Text>
        </>
    )
}