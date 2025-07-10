import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [message, setMessage] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setMessage(data.message || 'Connected to backend!');
        setLoading(false);
      } catch (err) {
        setError('Failed to connect to backend. Make sure the backend is running on port 3000.');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>DCFM360 App</title>
        <meta name="description" content="DCFM360 frontend application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container">
          <h1>DCFM360 Frontend</h1>
          <div className="card">
            <h2>Backend Connection Status:</h2>
            {loading ? (
              <p>Checking connection to backend...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : (
              <p className="success">{message}</p>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .card {
          margin-top: 1.5rem;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          width: 100%;
          max-width: 800px;
        }

        .card h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .error {
          color: #ff0000;
        }

        .success {
          color: #00cc00;
        }
      `}</style>
    </>
  );
}
