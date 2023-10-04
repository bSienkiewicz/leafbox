'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    router.push('/login');
  }, []);

  return <p className='text-center mt-4 text-xl'>Logging you out...</p>;
};

export default LogoutPage;