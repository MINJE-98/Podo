import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Flex
      flexDirection="column"
      h="100%"
      w="100%"
      bg="white"
    >
      {children}
    </Flex>
  );
}
