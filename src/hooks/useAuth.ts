import { useState, useEffect } from 'react';

interface Doctor {
  id: string;
  name: string;
  imageUrl: string;
  specialty: string;
}

export function useAuth() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('doctor');
    setDoctor(null);
    console.log('Logging out...');
    window.location.href = 'https://medical-webpage-login.vercel.app/';
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedDoctor = localStorage.getItem('doctor');

    if (storedToken && storedDoctor) {
      try {
        const parsedDoctor: Doctor = JSON.parse(storedDoctor);
        setDoctor(parsedDoctor);
      } catch (error) {
        console.error('Error parsing doctor data from localStorage:', error);
        logout();
      }
    } else {
      console.log('No token or doctor data found, redirecting to login.');
      logout();
    }
  }, []);

  return { doctor, logout };
}