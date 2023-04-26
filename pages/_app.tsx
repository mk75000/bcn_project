import '@/styles/globals.css';
import '@/styles/index.module.css';
import type { AppProps } from 'next/app';
import Cookies from 'js-cookie';


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
