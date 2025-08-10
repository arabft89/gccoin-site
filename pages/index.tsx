import { useEffect, useState } from "react";
import { ethers } from "ethers";

/** ---------- Config ---------- **/

// Sepolia chain id in hex (MetaMask format)
const SEPOLIA_CHAIN_ID = "0xaa36a7";

// Prefer ENV var so we don’t hardcode in code.
const ENV_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim();
const FALLBACK_ADDRESS = "0xED298062aeF2A0c1459E926f740dB7b5e265780";

// ✅ Determine if env is present AND valid
const hasValidEnv =
  !!ENV_ADDRESS && ethers.utils.isAddress(ENV_ADDRESS);

// Use env if valid, otherwise fallback
const CONTRACT_ADDRESS = hasValidEnv ? ENV_ADDRESS! : FALLBACK_ADDRESS;

// ✅ Only show the orange banner if env is missing/invalid
const usingFallback = !hasValidEnv;

// Minimal ERC-20 read-only ABI
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
] as const;

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [totalSupply, setTotalSupply] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Runtime diagnostics in console
  useEffect(() => {
    console.log("---- Runtime Contract Address Check ----");
    console.log("ENV_ADDRESS (from Vercel):", ENV_ADDRESS || "Not set");
    console.log(
      "Is ENV_ADDRESS valid?:",
      ENV_ADDRESS ? ethers.utils.isAddress(ENV_ADDRESS) : "N/A"
    );
    console.log("Using CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
    console.log("Is CONTRACT_ADDRESS same as FALLBACK?:", isUsingFallback);
    console.log("----------------------------------------");
  }, []);

  const connectWallet = async () => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });

      setWalletAddress(accounts[0]);
      console.log("✅ Wallet connected:", accounts[0]);

      // Optional: sanity log chain
      const chainId: string = await (window as any).ethereum.request({
        method: "eth_chainId",
      });
      console.log("Chain ID:", chainId, "(expect", SEPOLIA_CHAIN_ID, "for Sepolia)");
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet.");
    }
  };

  const fetchTokenInfo = async () => {
    if (!walletAddress) return;

    setError("");
    setLoading(true);

    try {
      if (!ethers.utils.isAddress(walletAddress)) {
        setError("Wallet address is not valid.");
        setLoading(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, provider);

      // Get decimals first, then format everything else with it.
      const decimals: number = await contract.decimals();

      const [name, symbol, rawBalance, rawSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.balanceOf(walletAddress),
        contract.totalSupply(),
      ]);

      const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
      const formattedSupply = ethers.utils.formatUnits(rawSupply, decimals);

      setTokenName(name);
      setTokenSymbol(symbol);
      setBalance(formattedBalance);
      setTotalSupply(formattedSupply);

      // Helpful logs
      console.log("— Runtime checks —");
      console.log("Using CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
      console.log("Wallet Address (value):", walletAddress);
      console.log("Wallet Address (is valid):", ethers.utils.isAddress(walletAddress));
      console.log("Token Name:", name);
      console.log("Token Symbol:", symbol);
      console.log("Balance:", formattedBalance);
      console.log("Total Supply:", formattedSupply);
    } catch (err: any) {
      console.error("❌ Error reading token info:", err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      fetchTokenInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1>GCCoin dApp</h1>

      {/* On-page warning if we are using the hardcoded fallback */}
      {isUsingFallback && (
        <p style={{ color: "orange", fontWeight: "bold", marginBottom: "1rem" }}>
          ⚠ Using fallback contract address. Check your Vercel env var{" "}
          <code>NEXT_PUBLIC_CONTRACT_ADDRESS</code>.
        </p>
      )}

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

          {!!error && (
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
