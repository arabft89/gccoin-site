import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0xE6A81AFC3b9E0303F3ebDA957b61D3184077947";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState(""); // lowercase 'balance' 

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (err) {
        alert("Failed to connect wallet.");
        console.error(err);
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  const fetchTokenInfo = async () => {
    if (!walletAddress) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ],
      provider
    );

    try {
      const name = await contract.name();
      const symbol = await contract.symbol();
      const rawBalance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();
      const formatted = ethers.utils.formatUnits(rawBalance, decimals);

      setTokenName(name);
      setTokenSymbol(symbol);
      setBalance(formatted);
    } catch (err) {
      console.error("Error reading token info", err);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTokenInfo();
    }
  }, [walletAddress]);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>GCCoin dApp</h1>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p><strong>Connected:</strong> {walletAddress}</p>
          <p><strong>Token:</strong> {tokenName} ({tokenSymbol})</p>
          <p><strong>Your Balance:</strong> {balance} {tokenSymbol}</p>
        </div>
      )}
    </div>
  );
}
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">GCCoin dApp</h1>
      {!account ? (
        <button onClick={connectWallet} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Connect Wallet
        </button>
      ) : (
        <div className="text-center">
          <p className="mb-2">Connected: <strong>{account}</strong></p>
          <p className="mb-2">Token: <strong>{tokenName} ({tokenSymbol})</strong></p>
          <p>Your Balance: <strong>{balance}</strong></p>
        </div>
      )}
    </div>
  );
}
