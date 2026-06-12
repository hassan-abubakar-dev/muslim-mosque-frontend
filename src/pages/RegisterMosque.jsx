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

  const [isAgreed, setIsAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loggedInUser, fetchUserData } = useUserContext();

  const isDev = import.meta.env.VITE_ENV === 'development';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAgreed) return;

    setError('');
    setSuccess('');
    setLoading(true);

    // Required fields check (excluding optional description)
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
    };

    try {
      const res = await privateAxiosInstance.post('/mosques/register-mosque', body);

      if (res.status < 400) {
        setSuccess('Mosque registered successfully. Pending verification.');
        const mosque = res.data.mosque;

        setForm({
          mosqueName: '',
          country: '',
          state: '',
          localGovernment: '',
          description: '',
        });
        setIsAgreed(false);
        setLoading(false);
        await fetchUserData();
        navigate(`/mosque/${mosque.id}`, { replace: true });
      }
    } catch (err) {

      if (err?.response?.data?.message === 'You have already registered a mosque with this name in this local government area.') {
        setError('this mosque name already registered in this local government area.')
      } else {
        setError('Failed to register mosque. Please try again.');
      }
      setLoading(false);
      if (isDev) console.error(err.response?.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 mb-12">
      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-emerald-800">Register a Mosque</h1>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded text-center">{error}</div>}
          {success && <div className="text-sm text-emerald-700 bg-emerald-50 p-2 rounded text-center">{success}</div>}

          <label className="block">
            <span className="text-gray-700 text-sm">Mosque Name *</span>
            <input name="mosqueName" value={form.mosqueName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm" placeholder="Masjid An-Nur" />
          </label>
          <label className="block">
            <span className="text-gray-700 text-sm">Country *</span>
            <input name="country" value={form.country} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm" placeholder="Nigeria" />
          </label>
          <label className="block">
            <span className="text-gray-700 text-sm">State *</span>
            <input name="state" value={form.state} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm" placeholder="Kano" />
          </label>
          <label className="block">
            <span className="text-gray-700 text-sm">Local Government *</span>
            <input name="localGovernment" value={form.localGovernment} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm" placeholder="Nassarawa" />
          </label>

          {/* 🆕 Added Description Field */}
          <label className="block">
            <span className="text-gray-700 text-sm">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm"
              placeholder="Tell us a little bit about the mosque..."
              rows={3}
            />
          </label>

          <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-200 flex gap-2.5 items-start">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
                className="mt-1 accent-emerald-700"
              />
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Verification Notice:</strong> I understand this form drafts a <span className="font-semibold text-amber-700">Pending Review</span> profile. Masjiba compliance agents will audit the location before activating public discovery.
              </p>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !isAgreed}
              className="w-full bg-emerald-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition text-sm cursor-pointer"
            >
              {loading ? 'Registering...' : 'Register Mosque'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterMosque;