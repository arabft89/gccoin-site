import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// GCCoin contract details
const CONTRACT_ADDRESS = '0xE6A81AFC3b9E0303F3ebDA957b61D3184077947';
const ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
];

export default function Home() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState(null);
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    const accounts = await provider.send('eth_requestAccounts', []);
    setAccount(accounts[0]);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const [name, symbol, rawBalance] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.balanceOf(accounts[0])
    ]);

    setTokenName(name);
    setTokenSymbol(symbol);
    setBalance(ethers.utils.formatUnits(rawBalance, 18));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">GCCoin dApp</h1>
      {!account ? (
        <button onClick={connectWallet} className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Connect Wallet
        </button>
      ) : (
        <div className="text-center">
          <p className="mb-2">Connected: <strong>{account}</strong></p>
          <p className="mb-2">Token: <strong>{tokenName} ({tokenSymbol})</strong></p>
          <p>Your Balance: <strong>{balance}</strong></p>
        </div>
      )}
    </div>
  );
}
