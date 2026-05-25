import { useState } from 'react';
import publicAxiosInstance from '../../auth/publicAxiosInstance';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import Toast from '../components/Toast';
import MasjibaLogoMark from '../assets/masjiba-logo-mark.png';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {fetchUserProfile, setLoggedInUser, fetchUserData} = useUserContext();
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
        await fetchUserData();

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
  <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 md:mt-10">
    <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-6">
      
      {/* HEADER & LOGO LOGICAL BRANDING BLOCK */}
      <div className="flex flex-col items-center text-center mb-5">
        <img 
          src={MasjibaLogoMark} 
          alt="Masjiba Logo" 
          className="h-20 w-auto object-contain mb-3" 
        />
        <h1 className="text-2xl font-semibold text-emerald-800">Log In</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter your credentials to access your account.
        </p>
      </div>

      {networkError && <Toast />}

      {/* INTERACTIVE INPUT FORM */}
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* EMAIL INPUT */}
        <label className="block">
          <span className="text-gray-700 text-sm">Email *</span>
          <input 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" 
            placeholder="you@example.com" 
          />
        </label>

        {/* PASSWORD INPUT WITH CONTEXTUAL UTILITY LINK */}
        <label className="block">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 text-sm">Password *</span>
            
            {/* 🔗 FORGOT PASSWORD ROUTE MOCK LINK */}
            <button 
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <input 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} 
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" 
            placeholder="Enter your password" 
          />
        </label>

        {/* ACTIONS & BUTTON CTAS */}
        <div className="pt-2">
          <button 
            type="submit"  
            disabled={loading} 
            className="w-full bg-emerald-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer transition-colors"
          >
             {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </form>

      {/* 🔗 SIGN UP REDIRECT FOOTER PATH LINK */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={() => navigate('/signup')}
            className="font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer transition-colors"
          >
            Sign Up
          </button>
        </p>
      </div>

    </div>
  </div>
);
};

export default Login;
