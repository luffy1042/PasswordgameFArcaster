import "./globals.css"
import { WagmiProvider } from '../providers/WagmiProvider'

export const metadata = {
  title: 'QuirkyLock - Farcaster Mini App',
  description: 'The ultimate password challenge game on Farcaster. Pay 0.01 USDC to play!',
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
