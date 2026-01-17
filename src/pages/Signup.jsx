import { useState } from 'react';
import Header from '../components/Header';
import publicAxiosInstance from '../../auth/publicAxiosInstance';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ firstName: '', surname: '', email: '', password: '', gender: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!form.firstName || !form.surname || !form.email || !form.password || !form.gender) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const body = {
      firstName: form.firstName,
      surName: form.surname,
      email: form.email,
      password: form.password,  
      gender: form.gender
    }
     
    try {
      const res = await publicAxiosInstance.post('/auths/register', body);
      if(res.status < 400){
        console.log('Backend response:', res.data);
        setSuccess(`Success: ${res.data.message || 'User registered successfully!'}`);
        setForm({ firstName: '', surname: '', email: '', password: '', gender: '' });
        setLoading(false);
        navigate('/verify-email', { state: { email: form.email }});
      }
    } catch (err) {
      setError('Failed to register.');
      console.error('Registration error:', err.response?.data);
      setLoading(false);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-6 mt-20">
        <h1 className="text-2xl font-semibold text-emerald-800">Create an account</h1>
        <p className="text-sm text-gray-600 mt-1">Sign up to register your mosque or join the community.</p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-emerald-700">{success}</div>}

          <div className="flex gap-4">
            <label className="flex-1">
              <span className="text-gray-700 text-sm">First Name *</span>
              <input name="firstName" value={form.firstName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="John" />
            </label>
            <label className="flex-1">
              <span className="text-gray-700 text-sm">Surname *</span>
              <input name="surname" value={form.surname} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Doe" />
            </label>
          </div>
          

          <label className="block">
            <span className="text-gray-700 text-sm">Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="you@example.com" />
          </label>

          <label className="block">
            <span className="text-gray-700 text-sm">Password</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Enter a strong password" />
          </label>

          <label className="block">
            <span className="text-gray-700 text-sm">Gender *</span>
            <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300">
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <div className="pt-2">
            <button type="submit" disabled={loading} className="w-full bg-emerald-700 cursor-pointer text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4">By signing up you agree to our terms and privacy policy. This is a mock signup form for demo purposes.</p>
      </div>
    </div>
  );
};

export default Signup;
