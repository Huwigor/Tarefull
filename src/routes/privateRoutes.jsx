
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PrivateRoute({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    async function verificarLogin() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_ROUTE_SERVER}/api/cookieUser`, {
          withCredentials: true,
        });
        setAutenticado(!!res.data);
      } catch {
        setAutenticado(false);
      } finally {
        setLoading(false);
      }
    }

    verificarLogin();
  }, []);

  if (loading) return null; 

  if (!autenticado) {
    return <Navigate to="/loginUser" state={{ from: location }} replace />;
  }

  return children;
}
