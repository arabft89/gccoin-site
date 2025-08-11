import { useEffect, useState } from "react";
import { ethers } from "ethers";

// --- Config ---
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // MetaMask hex

// Always pull from ENV var
const ENV_ADDRESS: string = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "").trim();

// Safety fallback (only used if env var missing/invalid)
const FALLBACK_ADDRESS = "0xED298062aeF2A0c1459E926f740dB7b5e265780";

// Validate once
const isEnvValid = ethers.utils.isAddress(ENV_ADDRESS);

// Final contract address
const CONTRACT_ADDRESS = isEnvValid ? ENV_ADDRESS : FALLBACK_ADDRESS;

// Fallback flag
const isUsingFallback = !isEnvValid;

// Minimal ERC-20 ABI
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
] as const;

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debug logs
  useEffect(() => {
    console.log("==== Contract Address Debug ====");
    console.log("ENV_ADDRESS (from Vercel):", ENV_ADDRESS);
    console.log("Is ENV_ADDRESS valid?:", isEnvValid);
    console.log("FALLBACK_ADDRESS:", FALLBACK_ADDRESS);
    console.log("CONTRACT_ADDRESS (using):", CONTRACT_ADDRESS);
    console.log("Using fallback?:", isUsingFallback);
    console.log("===============================");
  }, []);

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

    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, provider);

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
      setError("Failed to fetch token data. See console for details.");
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

      {isUsingFallback && (
        <p
          style={{
            color: "orange",
            backgroundColor: "#fff8e1",
            padding: "10px",
            borderRadius: "6px",
            maxWidth: "500px",
            margin: "10px auto",
          }}
        >
          ⚠️ Using fallback contract address. Set{" "}
          <code>NEXT_PUBLIC_CONTRACT_ADDRESS</code> in Vercel to remove this warning.
        </p>
      )}

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

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          <strong>{error}</strong>
        </p>
      )}
    </div>
  );
}
