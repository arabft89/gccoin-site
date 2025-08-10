import { useEffect, useState } from "react";
import { ethers } from "ethers";

// ✅ Your verified Sepolia ERC-20 contract (from Etherscan)
const CONTRACT_ADDRESS = "0xED298062aeF2A0c1459E926f7f40dB7b5e265780";

// Small helper to get a provider safely
function getProvider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    return new ethers.providers.Web3Provider((window as any).ethereum);
  }
  return null;
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [totalSupply, setTotalSupply] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Connect wallet
  const connectWallet = async () => {
    setError("");
    const provider = getProvider();
    if (!provider) {
      setError("MetaMask not detected. Please install MetaMask.");
      alert("Please install MetaMask");
      return;
    }

    try {
      const accounts: string[] = await (provider.provider as any).request({
        method: "eth_requestAccounts",
      });
      const addr = (accounts?.[0] || "").trim();
      console.log("✅ Wallet connected:", addr);
      setWalletAddress(addr);
    } catch (err) {
      console.error(err);
      setError("Failed to connect wallet.");
      alert("Failed to connect wallet.");
    }
  };

  // Fetch token info from the contract
  const fetchTokenInfo = async () => {
    setError("");

    // Basic runtime checks
    console.log("— Runtime checks —");
    console.log("Using CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
    console.log("Wallet Address (value):", walletAddress);
    console.log("Wallet Address (type):", typeof walletAddress);
    console.log("Wallet Address (is valid):", ethers.utils.isAddress(walletAddress));
    console.log(
      "Is wallet same as CONTRACT_ADDRESS?:",
      walletAddress?.toLowerCase?.() === CONTRACT_ADDRESS.toLowerCase()
    );

    // Stop early if wallet isn’t ready
    if (!walletAddress) {
      setError("Connect your wallet first.");
      return;
    }
    if (!ethers.utils.isAddress(walletAddress)) {
      setError(`Wallet address is not valid: ${walletAddress}`);
      return;
    }

    // Validate the contract address once too
    if (!ethers.utils.isAddress(CONTRACT_ADDRESS)) {
      setError(`Configured CONTRACT_ADDRESS is not a valid address:\n"${CONTRACT_ADDRESS}"`);
      return;
    }

    const provider = getProvider();
    if (!provider) {
      setError("MetaMask not detected. Please install MetaMask.");
      return;
    }

    setLoading(true);
    try {
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

      // Read in sequence (clearer logs & errors)
      const name: string = await contract.name();
      const symbol: string = await contract.symbol();

      console.log("Calling balanceOf with:", walletAddress);
      const rawBalance: ethers.BigNumber = await contract.balanceOf(walletAddress);

      const decimals: number = await contract.decimals();
      const rawTotalSupply: ethers.BigNumber = await contract.totalSupply();

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
    } catch (err: any) {
      console.error("❌ Error reading token info:", err);
      setError(
        err?.reason ||
          err?.message ||
          "Failed to read token info. Check the console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when wallet changes
  useEffect(() => {
    if (walletAddress) {
      fetchTokenInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

          <button onClick={fetchTokenInfo} disabled={loading} style={{ marginTop: "1rem" }}>
            {loading ? "Loading..." : "Refresh"}
          </button>

          {!!error && (
            <p style={{ color: "crimson", whiteSpace: "pre-wrap", marginTop: "1rem" }}>
              <strong>Error:</strong> {error}
            </p>
          )}
        </div>
      )}
    </div>
