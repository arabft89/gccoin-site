import { useEffect, useState } from "react";
import { ethers } from "ethers";

// ✅ Replace with your actual deployed contract address
const CONTRACT_ADDRESS = "0xED298062aeF2A0c1459E926f740dB7b5e265780";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log("✅ Wallet connected:", accounts[0]);
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
    if (!ethers.utils.isAddress(walletAddress)) {
      console.error("❌ Invalid wallet address:", walletAddress);
      return;
    }

    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        [
          "function name() view returns (string)",
          "function symbol() view returns (string)",
          "function balanceOf(address) view returns (uint256)",
          "function decimals() view returns (uint8)",
          "function totalSupply() view returns (uint256)",
        ],
        provider
      );

      // ✅ Correct call with wallet address
      const name = await contract.name();
      const symbol = await contract.symbol();
      const rawBalance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();
      const rawTotalSupply = await contract.totalSupply();

      const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
      const formattedSupply = ethers.utils.formatUnits(rawTotalSupply, decimals);

      setTokenName(name);
      setTokenSymbol(symbol);
      setBalance(formattedBalance);
      setTotalSupply(formattedSupply);

      console.log("✅ Token Name:", name);
      console.log("✅ Token Symbol:", symbol);
      console.log("✅ Balance:", formattedBalance);
      console.log("✅ Total Supply:", formattedSupply);
    } catch (err) {
      console.error("❌ Error reading token info:", err);
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
          <p><strong>Token:</strong> {tokenName || "N/A"} ({tokenSymbol || "--"})</p>
          <p><strong>Your Balance:</strong> {balance || "N/A"}</p>
          <p><strong>Total Supply:</strong> {totalSupply || "N/A"}</p>
          {loading && <p style={{ color: "gray" }}>Fetching token info...</p>}
        </div>
      )}
    </div>
    };
