import React, { Component, useEffect, useState } from "react";
import SimpleStorageContract from "./contracts/PodoToken.json";
import getWeb3 from "./getWeb3";
// import solc from "solc";
import fs from "fs";

import "./App.css";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  useEffect(async ()=>{
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      setWeb3(web3)
      setAccount(accounts)
      setContract(instance)
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }, [])
  const a = () => {
    // contract.method.swapEtherToPodoToken()
  }
  return (
    <>
    <div>{accounts}</div>
    <button onClick={()=> a()}>펑션 뭐있니?</button>
    </>
  )
  
}
export default App;
