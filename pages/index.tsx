import { useEffect, useState } from "react";
import { ethers } from "ethers";

// 🔁 Keep this as your verified token contract on Sepolia
const CONTRACT_ADDRESS = "0xED298062aeF2A0c1459E926f740dB7b5e265780";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [tokenName, setTokenName] = useState<string>("");
  const [tokenSymbol, setTokenSymbol] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [totalSupply, setTotalSupply] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");

  // 1) Connect wallet
  const connectWallet = async () => {
    setErr("");
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
    } catch (e) {
      console.error(e);
      alert("Failed to connect wallet.");
    }
  };

  // 2) Read token info
  const fetchTokenInfo = async () => {
  if (!walletAddress) {
    console.warn("No wallet connected yet.");
    return;
  }

  setLoading(true);

  try {
    // 1) Sanity checks
    console.log("— Runtime checks —");
    console.log("Using CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
    console.log("Wallet Address (value):", walletAddress);
    console.log("Wallet Address (is valid):", ethers.utils.isAddress(walletAddress));

    if (!ethers.utils.isAddress(walletAddress)) {
      throw new Error(`Wallet address is invalid: ${walletAddress}`);
    }

    // 2) Provider + minimal ABI
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
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

    // 3) IMPORTANT: use walletAddress here (NOT the contract address)
    console.log("Calling balanceOf with:", walletAddress);

    const [name, symbol, rawBalance, decimals, rawSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.balanceOf(walletAddress), // ✅ correct
      contract.decimals(),
      contract.totalSupply(),
    ]);

    const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);
    const formattedSupply  = ethers.utils.formatUnits(rawSupply, decimals);

    setTokenName(name);
    setTokenSymbol(symbol);
    setBalance(formattedBalance);
    setTotalSupply(formattedSupply);

    console.log("✓ Token Name:", name);
    console.log("✓ Token Symbol:", symbol);
    console.log("✓ Balance:", formattedBalance);
    console.log("✓ Total Supply:", formattedSupply);
  } catch (err: any) {
    console.error("✗ Error reading token info:", err);
  } finally {
    setLoading(false);
  }
};

  // 3) Re-fetch when wallet changes
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
          <p><strong>Connected:</strong> {walletAddress}</p>
          <p><strong>Token:</strong> {tokenName || "N/A"} ({tokenSymbol || "--"})</p>
          <p><strong>Your Balance:</strong> {balance || "N/A"}</p>
          <p><strong>Total Supply:</strong> {totalSupply || "N/A"}</p>

          <button onClick={fetchTokenInfo} disabled={loading} style={{ marginTop: 12 }}>
            {loading ? "Loading..." : "Refresh"}
          </button>

          {err && (
            <p style={{ color: "crimson", maxWidth: 720, margin: "12px auto" }}>
              <strong>Error:</strong> {err}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
