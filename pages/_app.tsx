import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <div className="page-container">
        <Component {...pageProps} />
      </div>
      <style jsx>{`
        .page-container {
          padding-top: 20px;
        }
      `}</style>
    </>
  );
}
