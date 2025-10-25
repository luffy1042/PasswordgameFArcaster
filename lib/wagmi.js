import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

// USDC contract on Base
export const USDC_CONTRACT = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bda02913',
  abi: [
    {
      name: 'transfer',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        { name: 'to', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      outputs: [{ name: '', type: 'bool' }]
    },
    {
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ name: '', type: 'uint256' }]
    },
    {
      name: 'decimals',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: '', type: 'uint8' }]
    }
  ]
}

// Payment amount: 0.01 USDC (with 6 decimals)
export const PAYMENT_AMOUNT = BigInt(10000) // 0.01 * 10^6

// Recipient wallet
export const RECIPIENT_WALLET = '0x23d94F2B55b0D2375A293f3F44611680e8B0DC9F'

export const config = getDefaultConfig({
  appName: 'QuirkyLock',
  projectId: 'YOUR_PROJECT_ID', // You can get this from WalletConnect Cloud
  chains: [base],
  ssr: false, // If your dApp uses server side rendering (SSR)
})
