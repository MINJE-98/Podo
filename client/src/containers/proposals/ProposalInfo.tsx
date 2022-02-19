import { useLocation } from "react-router-dom";
import MainFlex from "../../components/boxs/MainFlex";
import PageTitle from "../../components/font/PageTitle";
import { ProposalDetail } from "../../components/proposals/ProposalDetail";

export default function ProposalInfo(){
    const campaignId = useQuery().get("campaignId");
    const proposalId = useQuery().get("proposalId");
    function useQuery() {
        return new URLSearchParams(useLocation().search);
      }
    return (
            <MainFlex>
                <PageTitle text="Proposal" />
                <ProposalDetail campaignId={campaignId} proposalId={proposalId}/>
            </MainFlex>
    )
}