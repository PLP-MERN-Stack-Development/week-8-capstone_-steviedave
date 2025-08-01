import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/profile`, {
          credentials: 'include',
        });

        if (response.ok) {
          const userInfo = await response.json();
          setUserInfo(userInfo);
        } else {
          console.warn('Failed to fetch profile. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    fetchProfile();
  }, [setUserInfo]);

  function logout() {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        Techie's Blog
      </Link>
      <nav>
        {username ? (
          <>
            <Link to="/create">Create New Post</Link>
            <Link onClick={logout} style={{ cursor: 'pointer' }}>Logout</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
