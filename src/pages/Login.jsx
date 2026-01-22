import { useState } from 'react';
import publicAxiosInstance from '../../auth/publicAxiosInstance';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import Toast from '../components/Toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {fetchUserProfile, setLoggedInUser} = useUserContext();
  const [networkError, setNotworkError] = useState(false);
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

    if (!form.email || !form.password) {
      setLoading(false);
      setError('Please fill in all required fields.');
      return;
    }
    const body = {
      email: form.email,
      password: form.password,
    };

    try{
      const res = await publicAxiosInstance.post('/auths/login', body);
      if(res.status < 400){
        setSuccess(`Success: ${res.data.message || 'Login successful!'}`);
        setForm({ email: '',  password: '' });
        setLoading(false);
        const accessToken = res.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        setLoggedInUser(res.data.user);
        await fetchUserProfile();

        navigate('/', { replace: true });
      }
    } 
    catch(err){
      
      setLoading(false);
      
      if(err?.response?.data?.message === 'Please provide a valid email address'){
        setError('Login failed. invalid email address Please try again.')
      }else if(err?.response?.data?.message === 'incorrect password'){
        setError('Login failed. incorrect password Please try again.');
      }else{
        setNotworkError(true);
      }

      if(isDev){
        console.log('err.response', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-6 ">
        <h1 className="text-2xl font-semibold text-emerald-800">Log In</h1>
        <p className="text-sm text-gray-600 mt-1">Enter your credentials to access your account.</p>
      {networkError && <Toast />}
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-emerald-700">{success}</div>}

          <label className="block">
            <span className="text-gray-700 text-sm">Email *</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="you@example.com" />
          </label>

          <label className="block">
            <span className="text-gray-700 text-sm">Password *</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Enter your password" />
          </label>

          <div className="pt-2">
            <button type="submit"  disabled={loading} className="w-full bg-emerald-700 text-white px-4  cursor-pointer py-2 rounded-md font-semibold hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-400">
               {loading ? 'Signing up...' : 'Log In'}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4">This is a mock login form for demo purposes.</p>
      </div>
    </div>
  );
};

export default Login;
