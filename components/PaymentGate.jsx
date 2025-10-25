'use client'

import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useUSDCGate } from '../hooks/useUSDCGate'
import { RECIPIENT_WALLET } from '../lib/wagmi'
import styles from './PaymentGate.module.css'

export default function PaymentGate({ onPaymentComplete }) {
  const {
    isConnected,
    hasPaid,
    isFarcasterEnv,
    isLoading,
    error,
    usdcBalance,
    connectWallet,
    payToPlay,
    isConfirmed,
    canTransfer
  } = useUSDCGate()

  // Format USDC balance for display
  const formatUSDC = (balance) => {
    if (!balance) return '0.00'
    return (Number(balance) / 1000000).toFixed(2)
  }

  if (hasPaid) {
    return (
      <div className={styles.paymentSuccess}>
        <div className={styles.successIcon}>✅</div>
        <h2>Payment Successful!</h2>
        <p>Welcome to QuirkyLock! You can now start playing.</p>
        <button 
          className={styles.startButton}
          onClick={onPaymentComplete}
        >
          Start Game
        </button>
      </div>
    )
  }

  return (
    <div className={styles.paymentGate}>
      <div className={styles.header}>
        <h1>🔐 QuirkyLock</h1>
        <p>The Ultimate Password Challenge</p>
      </div>

      <div className={styles.paymentCard}>
        <div className={styles.paymentInfo}>
          <h2>Pay to Play</h2>
          <p>To access this exclusive game, please pay 0.01 USDC</p>
          
          {isFarcasterEnv && (
            <div className={styles.farcasterBadge}>
              🟣 Playing in Farcaster
            </div>
          )}
        </div>

        <div className={styles.walletInfo}>
          {isConnected ? (
            <div className={styles.connectedWallet}>
              <div className={styles.walletStatus}>
                <span className={styles.statusDot}></span>
                Wallet Connected
              </div>
              <div className={styles.balance}>
                USDC Balance: {formatUSDC(usdcBalance)}
              </div>
            </div>
          ) : (
            <div className={styles.connectPrompt}>
              <p>Connect your wallet to continue</p>
            </div>
          )}
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.actionButtons}>
          {!isConnected ? (
            <div className={styles.connectButtonWrapper}>
              <ConnectButton />
            </div>
          ) : (
            <button
              className={styles.payButton}
              onClick={payToPlay}
              disabled={isLoading || !canTransfer}
            >
              {isLoading ? (
                isConfirmed ? 'Processing...' : 'Confirming...'
              ) : (
                'Pay 0.01 USDC to Play'
              )}
            </button>
          )}
        </div>

        <div className={styles.paymentDetails}>
          <small>
            Payment goes to: {RECIPIENT_WALLET.slice(0, 6)}...{RECIPIENT_WALLET.slice(-4)}
          </small>
        </div>
      </div>
    </div>
  )
}
