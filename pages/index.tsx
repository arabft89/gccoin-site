// pages/index.tsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";

/** ---- Types for window.ethereum (quiet TypeScript) ---- */
declare global {
  interface Window {
    ethereum?: any;
  }
}

/** ---- Config ---- */
// Sepolia chain id in hex (MetaMask format)
const SEPOLIA_CHAIN_ID = "0xaa36a7";

// Prefer ENV var so we don’t hardcode in code. (No quotes in Vercel value!)
const ENV_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim();
// Keep your working address as a safe fallback so it still works locally.
const FALLBACK_ADDRESS = "0xED298062aeF2A0c1459E926f7f40dB7b5e265780"; 
const CONTRACT_ADDRESS = ENV_ADDRESS && ethers.utils.isAddress(ENV_ADDRESS)
  ? ENV_ADDRESS
  : FALLBACK_ADDRESS;

// Minimal ERC-20 read-only ABI
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
  const [error, setErr] = useState("");

  /** Connect wallet + (politely) ask user to switch to Sepolia if needed */
  const connectWallet = async () => {
    setErr("");
    if (!window.ethereum) {
      setErr("MetaMask not detected. Please install MetaMask and refresh.");
      return;
    }
    try {
      // Request accounts
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const addr = accounts[0];
      setWalletAddress(addr);

      // Make sure we’re on Sepolia
      const chainId: string = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchErr: any) {
          // If chain is not added, try to add it
          if (switchErr?.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: SEPOLIA_CHAIN_ID,
                    chainName: "Sepolia",
                    rpcUrls: ["https://rpc.sepolia.org"],
                    nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                  },
                ],
              });
            } catch {
              setErr("Please switch your MetaMask network to Sepolia and try again.");
            }
          } else {
            setErr("Please switch your MetaMask network to Sepolia and try again.");
          }
        }
      }
    } catch (e: any) {
      setErr(e?.message || "Failed to connect wallet.");
    }
  };

  /** Fetch token info from chain */
  const fetchTokenInfo = async () => {
    setErr("");

    if (!walletAddress) return;

    if (!ethers.utils.isAddress(walletAddress)) {
      setErr("Wallet address is not valid.");
      return;
    }
    if (!ethers.utils.isAddress(CONTRACT_ADDRESS)) {
      setErr(`Configured CONTRACT_ADDRESS is not a valid address: ${CONTRACT_ADDRESS}`);
      return;
    }
    if (!window.ethereum) {
      setErr("MetaMask not detected.");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, provider);

      // Parallel calls
      const [name, symbol, decimals, rawTotal, rawBal] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
        contract.balanceOf(walletAddress),
      ]);

      const formattedBalance = ethers.utils.formatUnits(rawBal, decimals);
      const formattedSupply = ethers.utils.formatUnits(rawTotal, decimals);

      setTokenName(name);
      setTokenSymbol(symbol);
      setBalance(formattedBalance);
      setTotalSupply(formattedSupply);
    } catch (e: any) {
      setErr(e?.reason || e?.message || "Error reading token info.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch after connecting
  useEffect(() => {
    if (walletAddress) fetchTokenInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>GCCoin dApp</h1>

      {!walletAddress ? (
        <button onClick={connectWallet} style={{ padding: "0.6rem 1rem", borderRadius: 8 }}>
          Connect Wallet
        </button>
      ) : (
        <div>
          <p><strong>Connected:</strong> {walletAddress}</p>
          <p><strong>Token:</strong> {tokenName || "N/A"} ({tokenSymbol || "--"})</p>
          <p><strong>Your Balance:</strong> {balance || "N/A"}</p>
          <p><strong>Total Supply:</strong> {totalSupply || "N/A"}</p>

          <button
            onClick={fetchTokenInfo}
            disabled={loading}
            style={{
              marginTop: "0.75rem",
              padding: "0.6rem 1rem",
              borderRadius: 8,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>

          {!!error && (
            <p
              style={{
                color: "crimson",
                whiteSpace: "pre-wrap",
                marginTop: "1rem",
                maxWidth: 640,
                marginLeft: "auto",
                marginRight: "auto",
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
