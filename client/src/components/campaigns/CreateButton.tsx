import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function CreateButton() {
    return (
        <Link to="/campaigncreate">
        <Button
            px="9"
            backgroundColor="purple.500"
            color="white"
            _focus={{
                border: "0"
            }}
        >
            캠페인 생성
        </Button>
        </Link>
    )
}