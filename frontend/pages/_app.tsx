import "styles/global.scss"; // Global styles
import type { AppProps } from "next/app"; // Types
import { Provider } from "next-auth/client"; // Next auth state

export default function MultiFaucet({ Component, pageProps }: AppProps) {
  return (
    // Wrap app in auth session provider
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}
