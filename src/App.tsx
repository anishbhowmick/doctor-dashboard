import React, { useEffect, useState } from 'react';
import { Header } from './components/layout/Header';
import { Clock } from './components/dashboard/Clock';
import { QuickStats } from './components/dashboard/QuickStats';
import { PatientSearch } from './components/patients/PatientSearch';
import { PatientDetails } from './components/patients/PatientDetails';
import { PrescriptionForm } from './components/prescriptions/PrescriptionForm';
import { Patient, Doctor } from './types';
import { X } from 'lucide-react';
import axios from 'axios';

function App() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    // Function to extract token from URL
    const getTokenFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      return params.get('token');
    };

    const token = getTokenFromUrl();

    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);

      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Fetch doctor data
      fetchDoctorData(token);
    } else {
      // Optionally, redirect to login if token is missing
      window.location.href = 'https://medical-webpage-login.vercel.app/';
    }
  }, []);

  const fetchDoctorData = async (token: string) => {
    try {
      const response = await axios.get('https://medical-backend-l140.onrender.com/api/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctor(response.data);
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      // Handle error, possibly redirect to login
      window.location.href = 'https://medical-webpage-login.vercel.app/';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleClosePatientDetails = () => {
    setSelectedPatient(null);
  };

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header doctor={doctor} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Greeting and Clock Section */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-lg shadow-md p-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()}, Dr. {doctor.name.split(' ')[1]}
              </h1>
              <p className="text-gray-600">Welcome to your dashboard</p>
            </div>
            <Clock />
          </div>

          {/* Quick Stats Section */}
          <QuickStats />

          {/* Patient Search Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Patient Management</h2>
            <PatientSearch
              onSearch={(query) => console.log('Searching:', query)}
              patients={[]} // Replace with actual patient data fetched from API
              onSelectPatient={handlePatientSelect}
            />
          </div>

          {/* Patient Details Section */}
          {selectedPatient && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Patient Details</h2>
                <button
                  onClick={handleClosePatientDetails}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <PatientDetails
                patient={selectedPatient}
                vitalStats={[]} // Replace with actual vital stats fetched from API
              />
            </div>
          )}

          {/* Prescription Section */}
          {selectedPatient && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Prescriptions</h2>
              <PrescriptionForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;