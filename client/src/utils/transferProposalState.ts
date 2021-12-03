import proposalState from "./ProposalState.json";

export default function transferProposalState(data: number): string {
  if (data === 0) {
    return proposalState[0];
  }
  if (data === 1) {
    return proposalState[1];
  }
  if (data === 2) {
    return proposalState[2];
  }
  if (data === 3) {
    return proposalState[3];
  }
  if (data === 4) {
    return proposalState[4];
  }
  if (data === 5) {
    return proposalState[5];
  } else {
    return "알수없음";
  }
}
