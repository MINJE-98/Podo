import { Box, Text } from "@chakra-ui/react";

export default function ButtonTitle({text, button}:any) {
    return (
        <>
        <Box>
        <Text
                fontFamily="Poppins"
                fontSize="18px"
                fontWeight="600"
                lineHeight="22px"
                letterSpacing="-0.9px"
                color="#fff"
            >
                {text}
                </Text>
        </Box>
        </>
    )
}