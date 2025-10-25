import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, useConnect } from 'wagmi'
import { sdk } from '@farcaster/miniapp-sdk'
import { USDC_CONTRACT, PAYMENT_AMOUNT, RECIPIENT_WALLET } from '../lib/wagmi'

export function useUSDCGate() {
  const [isFarcasterEnv, setIsFarcasterEnv] = useState(false)
  const [hasPaid, setHasPaid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  
  // Read USDC balance
  const { data: usdcBalance } = useReadContract({
    address: USDC_CONTRACT.address,
    abi: USDC_CONTRACT.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address
    }
  })

  // Write USDC transfer transaction (wagmi v2)
  const { 
    writeContract, 
    data: hash, 
    isPending: isWritePending,
    error: writeError 
  } = useWriteContract()

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Detect Farcaster MiniApp environment
  useEffect(() => {
    const detectFarcasterEnv = async () => {
      try {
        // Check if we're in a Farcaster MiniApp environment
        if (typeof window !== 'undefined' && window.farcaster) {
          setIsFarcasterEnv(true)
          // Initialize Farcaster SDK
          await sdk.actions.ready()
        } else {
          setIsFarcasterEnv(false)
        }
      } catch (err) {
        console.log('Not in Farcaster environment:', err)
        setIsFarcasterEnv(false)
      }
    }

    detectFarcasterEnv()
  }, [])

  // Check if user has already paid in this session
  useEffect(() => {
    const paidStatus = localStorage.getItem('quirkylock_paid')
    if (paidStatus === 'true') {
      setHasPaid(true)
    }
  }, [])

  // Handle payment confirmation
  useEffect(() => {
    if (isConfirmed && hash) {
      setHasPaid(true)
      localStorage.setItem('quirkylock_paid', 'true')
      setIsLoading(false)
      setError(null)
    }
  }, [isConfirmed, hash])

  // Handle write errors
  useEffect(() => {
    if (writeError) {
      setError(writeError.message)
      setIsLoading(false)
    }
  }, [writeError])

  const connectWallet = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (isFarcasterEnv) {
        // Use Farcaster embedded wallet
        await sdk.actions.openLink('https://quirkylock-disa3ywr1-luffy1042s-projects.vercel.app/')
      } else {
        // Use RainbowKit wallet connection
        if (connectors.length > 0) {
          await connect({ connector: connectors[0] })
        } else {
          throw new Error('No wallet connectors available')
        }
      }
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const payToPlay = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (!isConnected) {
        throw new Error('Please connect your wallet first')
      }

      if (!usdcBalance || usdcBalance < PAYMENT_AMOUNT) {
        throw new Error('Insufficient USDC balance. You need at least 0.01 USDC to play.')
      }

      // Execute USDC transfer using wagmi v2 writeContract
      await writeContract({
        address: USDC_CONTRACT.address,
        abi: USDC_CONTRACT.abi,
        functionName: 'transfer',
        args: [RECIPIENT_WALLET, PAYMENT_AMOUNT]
      })

    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const resetPayment = () => {
    setHasPaid(false)
    localStorage.removeItem('quirkylock_paid')
  }

  return {
    isConnected,
    hasPaid,
    isFarcasterEnv,
    isLoading: isLoading || isWritePending || isConfirming,
    error: error || writeError?.message,
    usdcBalance,
    connectWallet,
    payToPlay,
    resetPayment,
    isConfirmed,
    canTransfer: !!usdcBalance && usdcBalance >= PAYMENT_AMOUNT
  }
}
