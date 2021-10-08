import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {

    window.addEventListener("load", async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          // Accounts now exposed
          window.ethereum.on("chainChanged", (chainId) => {
            if (chainId != "0x539") {
              console.log("사용할 수 있는 네트워크 아님");
              window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x539" }],
              });
              resolve(web3);
            }
          });
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // // Legacy dapp browsers...
      // else if (window.web3) {
      //   // Use Mist/MetaMask's provider.
      //   const web3 = window.web3;
      //   console.log("Injected web3 detected.");
      //   resolve(web3);
      // }
      // // Fallback to localhost; use dev console port by default...
      // else {
      //   const provider = new Web3.providers.HttpProvider(
      //     "http://127.0.0.1:7545"
      //   );
      //   const web3 = new Web3(provider);
      //   console.log("No web3 instance injected, using Local web3.");
      //   resolve(web3);
      // }
    });
  });

export default getWeb3;