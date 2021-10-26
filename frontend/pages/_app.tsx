import "styles/global.scss"; // Global styles
import type { AppProps } from "next/app"; // Types
import { Provider } from "next-auth/client"; // Next auth state
import "react-toastify/dist/ReactToastify.css"; // Toast styles
import { ToastContainer } from "react-toastify"; // Toast notifications

export default function MultiFaucet({ Component, pageProps }: AppProps) {
  return (
    // Wrap app in auth session provider
    <Provider session={pageProps.session}>
      {/* Toast container */}
      <ToastContainer />

      {/* Site */}
      <Component {...pageProps} />
    </Provider>
  );
}
