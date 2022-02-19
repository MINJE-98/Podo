import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function ProposalCreateButton({campaignId}: any){
    return (
            <Link to={`/proposalcreate?campaignId=${campaignId}`}>
            <Button
                px="9"
                backgroundColor="purple.500"
                color="white"
                _focus={{
                    border: "0"
                }}
            >제안서 작성하기</Button>
            </Link>
    )
}