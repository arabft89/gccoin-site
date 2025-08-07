import { useEffect, useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xED298062aeF2A0c1459E926f740dB7b5e265780";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [formattedSupply, setFormattedSupply] = useState("");
  const [loading, setLoading] = useState(false);
  

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (err) {
        alert("Failed to connect wallet.");
      }
    } else {
      alert("Please install MetaMask");
    }
  };

  const fetchTokenInfo = async () => {
    if (!walletAddress) return;
    setLoading(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      [
        "function name() external view returns (string memory)",
        "function symbol() external view returns (string memory)",
        "function balanceOf(address) external view returns (uint256)",
        "function decimals() external view returns (uint8)",
        "function totalSupply() external view returns (uint256)",
      ],
      provider
    );

    try {
      const [name, symbol, rawBalance, decimals, rawSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.balanceOf(walletAddress),
        contract.decimals(),
        contract.totalSupply()
      ]);
      console.log("Token Name:"), name);
      console.log("Token Symbol:"), symbol);
      console.log("Balance:"), formattedBalance);
      console.log("Total Supply:"), formattedSupply);

      const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
      const formattedSupply = ethers.utils.formatUnits(rawSupply, decimals);

      setTokenName(name);
      setTokenSymbol(symbol);
      setBalance(formattedBalance);
      setTotalSupply(formattedSupply);
    } catch (err) {
      console.error("Error reading token info", err);
    }

    setLoading(false);
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
          <p><strong>Token:</strong> {tokenName || "N/A"} ({tokenSymbol || "-"})</p>
          <p><strong>Your Balance:</strong> {balance} {tokenSymbol}</p>
          <p><strong>Total Supply:</strong> {formattedSupply || "N/A"}</p>
          {loading && <p style={{ color: "gray" }}>Fetching token info...</p>}
        </div>
      )}
    </div>
  );
}
