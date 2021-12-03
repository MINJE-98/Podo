import { Box } from "@chakra-ui/layout";
import { useGetProposalLength } from "../../hooks/proposals";
import ProposalSampleInfo from "./ProposalSampleInfo";

export default function ProposalLists({campaignId}: any){
    const proposalLength = useGetProposalLength(campaignId);
    var proposalId = Array.from({length: proposalLength}, (v,i) => i);
    return (
        <Box>
            {proposalId.map((v:any)=> <ProposalSampleInfo key={v} proposalId={v} campaignId={campaignId} /> )}
        </Box>
    )
}