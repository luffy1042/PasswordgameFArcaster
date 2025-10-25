import "./globals.css"
import { WagmiProvider } from '../providers/WagmiProvider'

export const metadata = {
  title: 'QuirkyLock - Farcaster Mini App',
  description: 'The ultimate password challenge game on Farcaster. Pay 0.01 USDC to play!',
  manifest: '/manifest.json',
  themeColor: '#533ea5',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
  openGraph: {
    title: 'QuirkyLock - Password Challenge',
    description: 'The ultimate password challenge game with USDC payment gate. Can you survive all the password rules?',
    images: ['https://quirkylock-pd6o7szox-luffy1042s-projects.vercel.app/assets/icon.webp'],
    url: 'https://quirkylock-pd6o7szox-luffy1042s-projects.vercel.app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuirkyLock - Password Challenge',
    description: 'The ultimate password challenge game with USDC payment gate. Can you survive all the password rules?',
    images: ['https://quirkylock-pd6o7szox-luffy1042s-projects.vercel.app/assets/icon.webp'],
  },
}
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <head>
        <link href='https://fonts.googleapis.com/css?family=Roboto+Mono' rel='stylesheet'/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>
        <WagmiProvider>
          {children}
        </WagmiProvider>
      </body>
    </html>
  )
}
