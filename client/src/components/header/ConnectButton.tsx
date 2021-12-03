import { Button, Box, Text } from "@chakra-ui/react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { Link } from "react-router-dom";
import Identicon from "./Identicon";

export default function ConnectButton() {
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return account ? (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Link to="/mypage">
      <Button
        bg="purple.500"
        _focus={{
          borderColor:"purple.500"
        }}
      >
        <Text 
        color="white" 
        fontSize="md" 
        fontWeight="bold">
          {account &&
            `${account.slice(0, 6)}...${account.slice(
              account.length - 4,
              account.length
            )}`}
        </Text>
      </Button>
      </Link>
    </Box>
  ) : (
    <Button
      onClick={handleConnectWallet}
      bg="purple.500"
      color="white"
      fontSize="md"
      fontWeight="blod"
      fontFamily="Poppins"
      pt="1"
      _hover={{
        backgroundColor: "purple.500"
      }}
      _focus={{
        backgroundColor: "purple.500",
        border:"0"
      }}
    >
      Connect to a wallet
    </Button>
  );
}
