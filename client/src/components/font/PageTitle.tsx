import { Box, Flex, Spacer, Text } from "@chakra-ui/react";

export default function PageTitle({text, button}:any) {
    return (
        <>
        <Box>
        <Text
                fontFamily="Poppins"
                fontSize="40px"
                fontWeight="500"
                lineHeight="58px"
                letterSpacing="-0.9px"
                color="#0B254B"
            >
                {text}
                </Text>
        </Box>
        </>
    )
}