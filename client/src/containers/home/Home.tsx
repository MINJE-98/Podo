import { Box, Flex, Text } from "@chakra-ui/react";
import MainDesc from "../../components/home/MainDesc";
import MainHowToWork from "../../components/home/MainHowToWork";
import MainImage from "../../components/home/MainImage";

export default function Home(){
    return(
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Flex flexDirection="column" alignItems="center">
                <MainImage />
                <MainDesc />
                <MainHowToWork />
            </Flex>
        </Box>
    )
}