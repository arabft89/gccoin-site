// pages/index.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";

/** Let TypeScript know about window.ethereum */
declare global {
  interface Window {
    ethereum?: any;
  }
}

/** ✅ Make sure this is your ERC-20 token address on Sepolia (no spaces) */
const CONTRACT_ADDRESS = "0xED298062aeF2A0c1459E926f740dB7b5e265780";

/** Minimal ABI: only what we call */
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
];

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const connectWallet = async () => {
    setErrMsg("");
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    try {
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const addr = (accounts?.[0] || "").trim();
      console.log("✅ Wallet connected:", addr);
      console.log("Wallet Address (type):", typeof addr);
      setWalletAddress(addr);
    } catch (err) {
      console.error("Failed to connect wallet.", err);
      alert("Failed to connect wallet.");
    }
  };

  const fetchTokenInfo = async () => {
    setErrMsg("");
    if (!walletAddress) return;

    const trimmed = walletAddress.trim();
    const isValid = ethers.utils.isAddress(trimmed);

    console.log("—— Runtime checks ———————————————");
    console.log("Using CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
    console.log("Wallet Address (value):", `"${trimmed}"`);
    console.log("Wallet Address (is valid):", isValid);
    console.log(
      "Is wallet same as CONTRACT_ADDRESS?:",
      trimmed.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
    );
    console.log("———————————————————————————————");

    if (!isValid) {
      const m = `Invalid wallet address: ${trimmed}`;
      console.error(m);
      setErrMsg(m);
      return;
    }
    if (trimmed.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()) {
      const m =
        "Guard: walletAddress equals CONTRACT_ADDRESS. balanceOf() needs a wallet address, not the token address.";
      console.error(m);
      setErrMsg(m);
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, provider);

      // Fetch static token info first
      const [name, symbol, decimals, rawSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
      ]);

      // Log before calling balanceOf
      console.log("Calling balanceOf with:", trimmed);
      const rawBalance = await contract.balanceOf(trimmed);

      const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
      const formattedSupply = ethers.utils.formatUnits(rawSupply, decimals);

      setTokenName(name);
      setTokenSymbol(symbol);
      setBalance(formattedBalance);
      setTotalSupply(formattedSupply);

      console.log("✅ Token Name:", name);
      console.log("✅ Token Symbol:", symbol);
      console.log("✅ Balance (formatted):", formattedBalance);
      console.log("✅ Total Supply (formatted):", formattedSupply);
    } catch (err: any) {
      console.error("❌ Error reading token info:", err);
      setErrMsg(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) fetchTokenInfo();
  }, [walletAddress]);

  return (
    <div style={{ maxWidth: 720, margin: "5rem auto", textAlign: "center" }}>
      <h1>GCCoin dApp</h1>

      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>
            <strong>Connected:</strong> {walletAddress}
          </p>
          <p>
            <strong>Token:</strong> {tokenName || "N/A"} ({tokenSymbol || "--"})
          </p>
          <p>
            <strong>Your Balance:</strong> {balance || "N/A"}
          </p>
          <p>
            <strong>Total Supply:</strong> {totalSupply || "N/A"}
          </p>

          <div style={{ marginTop: 12 }}>
            <button onClick={fetchTokenInfo} disabled={loading}>
              {loading ? "Fetching…" : "Refresh"}
            </button>
          </div>

          {errMsg && (
            <p style={{ color: "crimson", marginTop: 12 }}>
              <strong>Error:</strong> {errMsg}
            </p>
          )}
        </>
      )}
    </div>
  );
}
