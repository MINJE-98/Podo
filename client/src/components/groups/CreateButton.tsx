import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function CreateButton() {
    return (
        <Link to="/groupcreate">
        <Button
            px="9"
            backgroundColor="purple.500"
            color="white"
            _focus={{
                border: "0"
            }}
        >
            그룹 생성
        </Button>
        </Link>
    )
}