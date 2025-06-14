import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import axios from 'axios';

function AuthCallback() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.get('http://localhost:8080/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const user = res.data;
          login(user, token);
          navigate('/');
        } catch (error) {
          console.error('Failed to fetch user data', error);
          navigate('/login');
        }
      };
      fetchUser();
    } else {
      console.error('Authentication callback is missing a token.');
      navigate('/login');
    }
  }, [login, location, navigate]);

  return (
    <div className="text-center p-10">
      <h1 className="text-2xl">Logging you in...</h1>
    </div>
  );
}

export default AuthCallback;