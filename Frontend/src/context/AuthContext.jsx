import { createContext, useState, useEffect, useContext } from 'react';
import api, { setAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Automated Session Sync: Self-heals and cleans memory state on app mount
  useEffect(() => {
    const autoAuthenticateSession = async () => {
      try {
        const res = await api.post('/auth/refresh');
        
        // 1. If we get a valid access token and explicit user data, commit it to memory
        if (res.data?.accessToken && res.data?.user?.name) {
          setAccessToken(res.data.accessToken);
          setUser(res.data.user);
        } else {
          // 2. If the response data layout is corrupted or incomplete, reset state safely
          setAccessToken(null);
          setUser(null);
        }
      } catch (err) {
        // 3. Automated Fallback: Wipes local data if cookie is invalid/expired
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    autoAuthenticateSession();
  }, []);

  const loginUser = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data;
  };

  const signupUser = async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
    return res.data;
  };

  const logoutUser = async () => {
    try {
      // Optional backend cookie clearance route
      await api.post('/auth/logout');
    } catch (e) {}
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, signupUser, logoutUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

