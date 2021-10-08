import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {Home, MyInfo, FundRaise, Vote } from './routes'
import Header from "./containers/Header";
import Footer from "./containers/Footer";
import Web3 from "web3";

function App() {
  useEffect(()=>{
    window.web3 = new Web3(window.ethereum);
    if(window.ethereum.chainId != "0x539") {
      window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x539" }],
      });
    }
    window.ethereum.on("chainChanged", (chainId) => {
      if (chainId != "0x539") {
        console.log("사용할 수 있는 네트워크 아님");
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x539" }],
        });
      }
      console.log(`체인 변경 ${chainId}`);
    });
  },[])
  return (
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/myinfo" exact component={MyInfo} />
          <Route path="/fundraise" exact component={FundRaise} />
          <Route path="/vote" exact component={Vote} />
        </Switch>
        <Footer />
      </Router>
  )
  
}
export default App;
