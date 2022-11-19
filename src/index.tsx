import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import View from 'view'

import reportWebVitals from 'reportWebVitals'
import { ConnectionProvider } from '@solana/wallet-adapter-react'
import configs from 'configs'
import 'static/styles/index.less'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { Coin98WalletAdapter } from '@solana/wallet-adapter-coin98'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

const { rpc: { endpoint } } = configs

createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[new PhantomWalletAdapter(), new Coin98WalletAdapter()]} autoConnect>
        <WalletModalProvider>
          <View />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </BrowserRouter>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
