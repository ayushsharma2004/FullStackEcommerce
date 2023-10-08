import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner';

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        console.log('adminroute');
        if (auth?.token) {
          const res = await axios.get(
            `${process.env.REACT_APP_API}/api/v1/auth/admin-auth`,
            {
              headers: {
                Authorization: `${auth.token}`,
              },
            }
          );
          console.log(res.data);
          if (res.data.ok) {
            setOk(true);
          } else {
            setOk(false);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setOk(false);
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path="" />;
}
