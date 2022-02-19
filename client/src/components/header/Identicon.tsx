import { useEffect, useRef } from "react";
import { useEthers } from "@usedapp/core";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const StyledIdenticon = styled.div`
`;

export default function Identicon() {
  const ref = useRef<HTMLDivElement>();
  const { account } = useEthers();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(30, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return (
    <Link to="/mypage">
      <StyledIdenticon ref={ref as any} />
    </Link>
  )
}
