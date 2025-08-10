import { useEffect, useState } from "react";
import { ethers } from "ethers";

// --- Config ---
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // MetaMask hex

// Only use the env var (no fallback)
const ENV_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim();

if (!ENV_ADDRESS || !ethers.utils.isAddress(ENV_ADDRESS)) {
  throw new Error(
    "Missing or invalid NEXT_PUBLIC_CONTRACT_ADDRESS. Set it in Vercel > Settings > Environment Variables."
  );
}

const CONTRACT_ADDRESS = ENV_ADDRESS;

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
  const [error, setError] = useState<string>("");

  const log = (...args: any[]) => {
    if (process.env.NODE_ENV !== "production") console.log(...args);
  };

  const connectWallet = async () => {
    setError("");
    if (typeof window === "undefined" || !window.ethereum) {
      setError("Please install MetaMask.");
      return;
    }
    try {
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);

      const chainId: string = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        setError("Please switch MetaMask to the Sepolia network.");
      }

      log("✅ Wallet connected:", accounts[0], "Chain:", chainId);
    } catch (err: any) {
      setError(err?.message || "Failed to connect wallet.");
    }
  };

  const fetchTokenInfo = async () => {
    setError("");
    if (!walletAddress) return;

    if (!CONTRACT_ADDRESS) {
      setError(
        "Contract address is missing or invalid. Set NEXT_PUBLIC_CONTRACT_ADDRESS in Vercel."
      );
      return;
    }

    if (!ethers.utils.isAddress(walletAddress)) {
      setError("Wallet address is not valid.");
      return;
    }

    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask not found.");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, provider);

      const [name, symbol, rawBalance, decimals, rawSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.balanceOf(walletAddress),
        contract.decimals(),
        contract.totalSupply(),
      ]);

      const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
      const formattedSupply = ethers.utils.formatUnits(rawSupply, decimals);

      setTokenName(name);
      setTokenSymbol(symbol);
      setBalance(formattedBalance);
      setTotalSupply(formattedSupply);

      log("Token:", { name, symbol, formattedBalance, formattedSupply });
    } catch (err: any) {
      setError(err?.reason || err?.message || "Error reading token info.");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  // Build-time logs (env var)
  console.log("==== Runtime Contract Address Check ====");
  console.log("ENV_ADDRESS (from Vercel):", ENV_ADDRESS);
  console.log("Is ENV_ADDRESS valid?:", ethers.utils.isAddress(ENV_ADDRESS));

  // Client/runtime logs (wallet + chain)
  const logRuntime = async () => {
    if (typeof window === "undefined") return;

    // Show current chain
    const chainIdHex = (await window.ethereum?.request?.({ method: "eth_chainId" })) as string | undefined;
    console.log("Chain ID:", chainIdHex, "(expect 0xaa36a7 for Sepolia)");

    // If you already store walletAddress in state, show the value & validity
    if (walletAddress) {
      console.log("Wallet Address (value):", walletAddress);
      console.log("Wallet Address (is valid):", ethers.utils.isAddress(walletAddress));
    }

    // Make it crystal clear what contract address is used at runtime
    console.log("Using CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
    console.log("========================================");
  };

  logRuntime();
  // Re-run when wallet changes so you see validity as you connect
}, [walletAddress]);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>GCCoin dApp</h1>

      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
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

          <button
            onClick={fetchTokenInfo}
            disabled={loading}
            style={{ marginTop: "1rem" }}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>

          {error && (
            <p
              style={{
                color: "crimson",
                whiteSpace: "pre-wrap",
                marginTop: "1rem",
              }}
            >
              <strong>Error:</strong> {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


