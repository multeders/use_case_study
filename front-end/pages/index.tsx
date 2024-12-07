import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1 className="mb-4">Welcome to Task Manager</h1>
          {!isAuthenticated ? (
            <>
              <Link href="/login" passHref>
                <button className="btn btn-primary w-100 mb-2">Login</button>
              </Link>
              <Link href="/register" passHref>
                <button className="btn btn-secondary w-100">Register</button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/tasks" passHref>
                <button className="btn btn-success w-100 mb-2">View Tasks</button>
              </Link>
              <button className="btn btn-danger w-100" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
