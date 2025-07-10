import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [message, setMessage] = useState('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
        const response = await fetch(`${backendUrl}/iot-status`);
        const data = await response.json();
        setMessage(data.message || 'Connected to backend!');
        setLoading(false);
      } catch (err) {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
        const port = new URL(backendUrl).port || '3000';
        setError(`Failed to connect to backend. Make sure the backend is running on port ${port}.`);
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
          <div className="card">
            <h2>IoT Device Management</h2>
            <p>View and monitor your connected IoT devices in real-time.</p>
            <div className="button-container">
              <Link href="/devices" className="button">View Devices</Link>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: calc(100vh - 80px);
          padding: 1rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        main {
          padding: 2rem 0;
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

        .button-container {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }

        .button {
          display: inline-block;
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .button:hover {
          background-color: #0051bb;
        }
      `}</style>
    </>
  );
}
