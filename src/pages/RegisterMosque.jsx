import { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import privateAxiosInstance from '../../auth/privateAxiosInstance';

const RegisterMosque = () => {
  const [form, setForm] = useState({
    mosqueName: '',
    country: '',
    state: '',
    localGovernment: '',
    description: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {loggedInUser} = useUserContext();

    const isDev = import.meta.env.VITE_ENV === 'development';

  const handleChange = (e) => { 
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!form.mosqueName || !form.country || !form.state || !form.localGovernment) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const body = {
        name: form.mosqueName,
        country: form.country,
        state: form.state,
        localGovernment: form.localGovernment,
        description: form.description,
      }

      

    try {
      const res = await privateAxiosInstance.post('/mosques/register-mosque', body)

      if (res.status < 400) {
        setSuccess('Mosque registered successfully. Pending verification.');
        setForm({
          mosqueName: '',
          country: '',
          state: '',
          localGovernment: '',
          description: '',
          adminEmail: form.adminEmail,
        });
        setLoading(false);
        navigate('/mosque', { replace: true });
      }
    } catch (err) {
      setError('Failed to register mosque. try again');
      setLoading(false);
      if(isDev){
         console.error(err.response?.data);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-6 mt-20">
        <h1 className="text-2xl font-semibold text-emerald-800">
          Register a Mosque
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Add your mosque to manage prayers, announcements, and community updates.
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-emerald-700">{success}</div>}

          <label className="block">
            <span className="text-gray-700 text-sm">Mosque Name *</span>
            <input
              name="mosqueName"
              value={form.mosqueName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Masjid An-Nur"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 text-sm">Country *</span>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Nigeria"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 text-sm">State *</span>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Kano"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 text-sm">Local Government *</span>
            <input
              name="localGovernment"
              value={form.localGovernment}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Nassarawa"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 text-sm">Description (optional)</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Brief description of the mosque"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 text-sm">Admin Email</span>
            <input
              value={loggedInUser?.email || ''}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register Mosque'}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          Mosque registrations are reviewed before verification.
        </p>
      </div>
    </div>
  );
};

export default RegisterMosque;