import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  avalanche,
  avalancheFuji
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { AppCacheProvider } from '@mui/material-nextjs/v13-pagesRouter'; // or `v14-pages` if you are using Next.js v14

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    avalanche,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [avalancheFuji] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Dik Dik Defense',
  projectId: 'c3b2748bd98f345f925b8ac5f0ccf40d',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps, props) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <AppCacheProvider {...props}>
          <Component {...pageProps} />
        </AppCacheProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
