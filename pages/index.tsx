import { useEffect, useState } from "react";
import { ethers } from "ethers";

// 🔴 Paste your address EXACTLY here (no spaces before/after)
const RAW_CONTRACT_ADDRESS = "0xED298062aeF2A0c1459E926f740dB7b5e265780";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [balance, setBalance] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    setError("");
    if (typeof (window as any).ethereum === "undefined") {
      alert("Please install MetaMask");
      return;
    }
    try {
      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0] ?? "");
      console.log("✅ Wallet connected:", accounts[0]);
    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet.");
    }
  };

  const fetchTokenInfo = async () => {
    setError("");
    if (!walletAddress) return;

    // 1) Validate wallet address
    const cleanWallet = walletAddress.trim();
    if (!ethers.utils.isAddress(cleanWallet)) {
      setError("Wallet address is not valid.");
      return;
    }

    // 2) Validate & normalize contract address (this is where the build/runtime error came from)
    const raw = RAW_CONTRACT_ADDRESS.trim(); // remove hidden whitespace
    if (!ethers.utils.isAddress(raw)) {
      setError(
        `Configured CONTRACT_ADDRESS is not a valid address: "${RAW_CONTRACT_ADDRESS}"`
      );
      return;
    }
    // Normalize checksum to avoid checksum-related rejections
    const contractAddress = ethers.utils.getAddress(raw);

    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );

      const abi = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function balanceOf(address) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function totalSupply() view returns (uint256)",
      ];

      const contract = new ethers.Contract(contractAddress, abi, provider);

      console.log("— Runtime checks —");
      console.log("Using CONTRACT_ADDRESS:", contractAddress);
      console.log("Wallet Address (value):", cleanWallet);
      console.log("Wallet Address (is valid):", ethers.utils.isAddress(cleanWallet));

      const [name, symbol, rawBalance, decimals, rawSupply] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.balanceOf(cleanWallet), // ✅ this must be the wallet address
        contract.decimals(),
        contract.totalSupply(),
      ]);

      const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
      const formattedSupply = ethers.utils.formatUnits(rawSupply, decimals);

      setTokenName(name);
      setTokenSymbol(symbol);
      setBalance(formattedBalance);
      setTotalSupply(formattedSupply);
    } catch (err: any) {
      console.error("❌ Error reading token info:", err);
      // Surface ethers invalid-address error message to the UI
      if (err?.code === "INVALID_ARGUMENT") {
        setError(`${err.message}`);
      } else {
        setError("Failed to read token info. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
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

          <button onClick={fetchTokenInfo} disabled={loading} style={{ marginTop: "1rem" }}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>

          {error && (
            <p style={{ color: "crimson", maxWidth: 600, margin: "1rem auto" }}>
              <strong>Error:</strong> {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
