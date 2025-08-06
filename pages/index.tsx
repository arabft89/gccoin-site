

import { useEffect, useState } from "react";
import { ethers } from "ethers";

// GCCoin contract address and ABI
const CONTRACT_ADDRESS = "0xE6A81AFC3b9E0303F3ebDA957b61D3184077947"; // Replace if re-deployed
const ABI = [
  "function pause() public",
  "function unpause() public",
  "function burn(uint256 amount) public",
  "function name() public view returns (string)",
  "function symbol() public view returns (string)",
  "function totalSupply() public view returns (uint256)",
];

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [contract, setContract] = useState<any>(null);
  const [paused, setPaused] = useState<boolean | null>(null);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("0");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    setWallet(address);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    setContract(contract);
  }

  async function fetchInfo() {
    if (!contract) return;
    const [n, s, t] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.totalSupply(),
    ]);
    setName(n);
    setSymbol(s);
    setSupply(ethers.formatUnits(t, 18));
  }

  async function handlePause() {
    try {
      setStatus("Pausing...");
      const tx = await contract.pause();
      await tx.wait();
      setStatus("Paused.");
    } catch (err) {
      setStatus("Pause failed.");
    }
  }

  async function handleUnpause() {
    try {
      setStatus("Unpausing...");
      const tx = await contract.unpause();
      await tx.wait();
      setStatus("Unpaused.");
    } catch (err) {
      setStatus("Unpause failed.");
    }
  }

  async function handleBurn() {
    try {
      setStatus("Burning...");
      const amount = ethers.parseUnits("10", 18); // 10 GCC
      const tx = await contract.burn(amount);
      await tx.wait();
      setStatus("Burn successful.");
    } catch (err) {
      setStatus("Burn failed.");
    }
  }

  useEffect(() => {
    if (contract) fetchInfo();
  }, [contract]);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-2">GCCoin dApp</h1>
      <p className="mb-6 text-gray-600">Interact with your verified Sepolia contract</p>

      {!wallet ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          Connect Wallet
        </button>
      ) : (
        <>
          <p className="text-sm mb-2">Connected: {wallet.slice(0, 6)}...{wallet.slice(-4)}</p>
          <div className="bg-white p-4 rounded shadow mb-4">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Symbol:</strong> {symbol}</p>
            <p><strong>Total Supply:</strong> {supply}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={handlePause} className="bg-red-500 text-white px-4 py-2 rounded">
              Pause
            </button>
            <button onClick={handleUnpause} className="bg-green-500 text-white px-4 py-2 rounded">
              Unpause
            </button>
            <button onClick={handleBurn} className="bg-yellow-500 text-white px-4 py-2 rounded">
              Burn 10 GCC
            </button>
          </div>
          <p className="mt-4 text-sm">{status}</p>
        </>
      )}
    </main>
  );
}
