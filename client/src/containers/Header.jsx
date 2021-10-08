import React, {useState, useEffect, useLayoutEffect} from "react";
import {Link} from 'react-router-dom';
import Web3 from "web3";

export default function Header(){
  const [accounts, setAccounts] = useState(null);
  useEffect(()=>{
    islogined();
  })
  const islogined = async () =>{
    const web3 = await new Web3(window.ethereum);
    web3.eth.getAccounts((err, accounts) =>{
      console.log(accounts);
      if (err != null) console.error("An error occurred: "+err);
      else if (accounts.length == 0) console.log("User is not logged in to MetaMask");
      else console.log("User is logged in to MetaMask");
  })
}
  const login = async() =>{
    console.log();
    if(window.ethereum.chainId != "0x539") {
      window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x539" }],
      });
    } else {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    }
    
  }
    return(
        <div style={{ display: 'flex', flexDirection: "row" }}>
            <div>로고</div>
            <div>
                <Link to="/">홈</Link>
            </div>
            <div>
                <Link to="/myinfo">마이페이지</Link>
            </div>
            <div>
                <Link to="/fundraise">모금활동</Link>
            </div>
            <div>
                <Link to="/vote">투표</Link>
            </div>
            {
              accounts ?
              <div>
                {accounts}
              </div>
              :
              <button onClick={()=> {
                login();
              }}>
              로그인!
            </button>
            }
            {console.log(accounts)}
        </div>
    )
}