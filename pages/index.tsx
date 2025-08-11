import { useEffect, useState } from "react";
import { ethers } from "ethers";

// --- Dev-only logger ---
const __DEV__ = process.env.NODE_ENV === "development";
const dbg = (...a: any[]) => { if (__DEV__) console.log(...a); };

const log = {
  section: (title: string) => dbg(`===== [${title}] =====`),
  line: () => dbg("=========================================="),
  ok: (label: string, v?: any) =>
    dbg(`%c${label}`, "color:green;font-weight:600;", v),
  warn: (label: string, v?: any) =>
    dbg(`%c${label}`, "color:orange;font-weight:600;", v),
  err: (label: string, v?: any) =>
    dbg(`%c${label}`, "color:crimson;font-weight:700;", v),
};

// Sepolia chain id in hex (MetaMask format)
const SEPOLIA_CHAIN_ID = "0xaa36a7";

// Get from environment variables (always string)
const ENV_ADDRESS: string = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "").trim();
const FALLBACK_ADDRESS = "0xED298062aeF2A0c1459E926f7f40dB7b5e265780";

const CONTRACT_ADDRESS =
  ENV_ADDRESS && ethers.utils.isAddress(ENV_ADDRESS)
    ? ENV_ADDRESS
    : FALLBACK_ADDRESS;

const isUsingFallback = CONTRACT_ADDRESS === FALLBACK_ADDRESS;

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
];

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    log.section("ENV Check");
    log.ok("ENV_ADDRESS:", ENV_ADDRESS);
    log.ok("Is ENV_ADDRESS valid?:", ethers.utils.isAddress(ENV_ADDRESS));
    log.ok("FALLBACK_ADDRESS:", FALLBACK_ADDRESS);
    log.ok("CONTRACT_ADDRESS (using):", CONTRACT_ADDRESS);
    log.warn("Using fallback?:", isUsingFallback);
    log.line();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      log.warn("Please install MetaMask");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);

      log.section("Wallet");
      log.ok("Wallet connected:", accounts[0]);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      log.ok("Chain ID (hex):", "0x" + network.chainId.toString(16));
      log.line();

    } catch (err) {
      log.err("Failed to connect wallet:", err);
    }
  };

  const fetchTokenInfo = async () => {
    if (!walletAddress) return;
    if (!ethers.utils.isAddress(walletAddress)) {
      log.err("Invalid wallet address:", walletAddress);
      return;
    }

    setLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, provider);

      const [name, symbol, rawBalance, decimals, rawTotalSupply] =
        await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.balanceOf(walletAddress),
          contract.decimals(),
          contract.totalSupply(),
        ]);

      const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
      const formattedSupply = ethers.utils.formatUnits(rawTotalSupply, decimals);

      setTokenName(name);
      setTokenSymbol(symbol);
      setBalance(formattedBalance);
      setTotalSupply(formattedSupply);

      log.section("Contract Info");
      log.ok("Token Name:", name);
      log.ok("Token Symbol:", symbol);
      log.ok("Decimals:", decimals);
      log.ok("Total Supply:", formattedSupply);
      log.line();

      log.section("Balance Info");
      log.ok("Wallet Address:", walletAddress);
      log.ok("Balance:", formattedBalance);
      log.line();

    } catch (err) {
      log.err("Error reading token info:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (walletAddress) fetchTokenInfo();
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
          <button onClick={fetchTokenInfo} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      )}
    </div>
  );
}
