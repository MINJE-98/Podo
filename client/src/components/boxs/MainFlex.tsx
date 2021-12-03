import { ReactNode } from "react";
import { Flex } from "@chakra-ui/layout";

type Props = {
    children?: ReactNode;
  };

export default function MainFlex({children}: Props) {
    return (
        <Flex
            flexDirection="column"
            mx="200px"
            my="72px"
        >
            {children}
        </Flex>
    )
}