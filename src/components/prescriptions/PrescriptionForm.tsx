import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface PrescriptionFormProps {
  patientId: string;
}

interface Prescription {
  medication: string;
  dosage: string;
  instructions: string;
}

export function PrescriptionForm({ patientId }: PrescriptionFormProps) {
  const [prescription, setPrescription] = useState<Prescription>({
    medication: '',
    dosage: '',
    instructions: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPrescription({
      ...prescription,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!prescription.medication || !prescription.dosage || !prescription.instructions) {
      toast.error('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token missing.');
      }

      await axios.post(
        'https://medical-backend-l140.onrender.com/api/prescriptions',
        {
          patientId,
          ...prescription,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Prescription added successfully.');

      // Reset form
      setPrescription({
        medication: '',
        dosage: '',
        instructions: '',
      });
    } catch (error: any) {
      console.error('Error adding prescription:', error);
      toast.error(error.response?.data?.error || 'Failed to add prescription.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="medication" className="block text-sm font-medium text-gray-700">
          Medication
        </label>
        <input
          type="text"
          name="medication"
          id="medication"
          value={prescription.medication}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
          Dosage
        </label>
        <input
          type="text"
          name="dosage"
          id="dosage"
          value={prescription.dosage}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
          Instructions
        </label>
        <textarea
          name="instructions"
          id="instructions"
          value={prescription.instructions}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          required
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 px-4 bg-gradient-to-r from-[#4A90E2] to-[#8E44AD] text-white font-semibold rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Add Prescription'}
      </button>
    </form>
  );
}