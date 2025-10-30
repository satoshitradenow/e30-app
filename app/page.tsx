'use client';
import { useState } from 'react';
import { ethers } from 'ethers';

// Add Ethereum to window for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function E30App() {
  const [connected, setConnected] = useState(false);
  const [amount, setAmount] = useState('');
  const [deposited, setDeposited] = useState(false);
  const MASTER_VAULT = '0xE30_MASTER_VAULT_HERE'; // Replace after creating vault

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Install MetaMask');
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    setConnected(true);
  };

  const deposit = async () => {
    if (!amount || parseFloat(amount) < 100) return alert('Min $100');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tx = await signer.sendTransaction({
      to: MASTER_VAULT,
      value: ethers.parseEther(amount)
    });
    await tx.wait();
    setDeposited(true);
    setTimeout(() => setDeposited(false), 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-sans">
      <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">E30</h1>
      <p className="text-xl mb-8 text-gray-400">1 Deposit → 3 Vaults (60% Whale | 20% BTC Short | 20% Grid)</p>

      <button
        onClick={connectWallet}
        className="mb-6 px-8 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
      >
        {connected ? 'Wallet Connected' : 'Connect Wallet'}
      </button>

      <div className="w-80">
        <input
          type="number"
          placeholder="USDC Amount (min $100)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-4 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 mb-4"
        />
        <button
          onClick={deposit}
          className="w-full p-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg font-bold text-black hover:scale-105 transition"
        >
          {deposited ? 'Deposited! Splitting...' : 'Deposit to E30'}
        </button>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Auto-rebalanced daily. Audited. Live on Hyperliquid.
      </p>
    </div>
  );
}
