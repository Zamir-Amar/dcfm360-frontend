import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          Data Center Fleet Management 360
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link href="/" className={router.pathname === "/" ? "nav-link active" : "nav-link"}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/devices" className={router.pathname === "/devices" ? "nav-link active" : "nav-link"}>
              Devices
            </Link>
          </li>
        </ul>
      </div>
      <style jsx>{`
        .navbar {
          background-color: #e6c700;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1rem;
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          padding: 0 24px;
        }

        .navbar-logo {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          margin-left: 24px;
        }

        .nav-link {
          color: #ffff00;
          text-decoration: none;
          padding: 8px 0;
          transition: color 0.2s ease;
        }

        .nav-link:hover {
          color: #0070f3;
        }

        .active {
          color: #0070f3;
          border-bottom: 2px solid #0070f3;
        }
      `}</style>
    </nav>
  );
}
