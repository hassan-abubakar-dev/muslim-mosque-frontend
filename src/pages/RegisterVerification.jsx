import { useState } from 'react';
import publicAxiosInstance from '../../auth/publicAxiosInstance';
import { replace, useLocation, useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import MasjibaLogoMark from '../assets/masjiba-logo-mark.png';

const RegisterVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { fetchUserProfile, setLoggedInUser } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isDev = import.meta.env.VITE_ENV === 'development';

  // 🛠️ CHANGED HERE: Extract both the email and the directional flow tracking flag state
  const registeredEmail = location.state?.email || '';
  const flowType = location.state?.flowType || 'registration'; // defaults to registration fallback

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setVerifyLoading(true);

    if (!verificationCode || verificationCode.trim() === '') {
      setError('Please enter the verification code.');
      setVerifyLoading(false);
      return;
    }

    
    // For recovery, your route expects both code and email to tie them together securely
    const body = flowType === 'recovery' 
      ? { verificationCode: verificationCode.trim(), email: registeredEmail }
      : { verificationCode: verificationCode.trim() };
    
  
    const endpoint = flowType === 'recovery' 
      ? '/verifications/verify-recovery-code' 
      : '/verifications/verify';

    try {
      const res = await publicAxiosInstance.post(endpoint, body);
      
      if (res.status < 400) {
        
        setSuccess(`Success: ${res.data.message || 'Code verified successfully!'}`);
        setVerificationCode('');
        setVerifyLoading(false);

        // 🛠️ CHANGED HERE: Fork execution pathways depending on user intent tracks
        if (flowType === 'recovery') {
          // Pass email and the secret resetToken securely to the final screen
          navigate('/reset-password', { 
            state: { 
              email: registeredEmail, 
              resetToken: res.data.resetToken 
            }, replace: true
          });
        } else {
          // Standard original Registration sequence logic track
          const accessToken = res.data.accessToken; 
          localStorage.setItem('accessToken', accessToken); 
          await fetchUserProfile();
          setLoggedInUser(res.data.user);
          navigate('/', { replace: true },);
        }
      }
    } catch (err) {
      if(isDev){
        console.error('Verification error details:', err?.response?.data || err);
      }
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout - server is not responding. Please try again.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid verification code.');
      } else if (err.response?.status === 404) {
        setError('Verification endpoint not found.');
      } else {
        setError('Failed to verify code: ' + (err.response?.data?.message || err.message));
      }
      setVerifyLoading(false);

      if (isDev) {
        console.error('Verification error:', err.response?.data?.message);
      }
      return;
    }
  };

  const handleResendCode = async () => {
    setError('');
    setResendLoading(true);

    try {
      const res = await publicAxiosInstance.post('/auths/new-verification-code', { email: registeredEmail });
      if (res.status < 400) {
        setSuccess('Verification code sent to your email.');
        setResendLoading(false);
        return;
      }
    } catch (err) {
      setError('Failed to resend code: try again');
      if(isDev){
        console.error('Resend code error:', err?.response?.data ||err);
      }
      setResendLoading(false);
    }
  };

 return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-6">
        
        {/* BRANDING LOGO SECTION */}
        <div className="flex flex-col items-center text-center mb-5">
          <img 
            src={MasjibaLogoMark} 
            alt="Masjiba Logo" 
            className="h-20 w-auto object-contain" 
          />
        </div>

        {/* Dynamic heading adaptation styling */}
        <h1 className="text-2xl font-semibold text-emerald-800 text-center">
          {flowType === 'recovery' ? 'Confirm Recovery Code' : 'Verify Your Email'}
        </h1>
        <p className="text-sm text-gray-600 mt-1 text-center">Enter the verification code we sent to your email address.</p>

        <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <p className="text-xs text-gray-600">Verification code sent to:</p>
          <p className="text-sm font-semibold text-emerald-800">{registeredEmail}</p>
          <p className="text-xs text-gray-500 mt-2">Check your inbox or spam folder for the code.</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
          {success && <div className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded">{success}</div>}

          <label className="block">
            <span className="text-gray-700 text-sm">Verification Code *</span>
            <input
              type="text"
              name="verificationCode"
              value={verificationCode}
              onChange={handleChange}
              placeholder="Enter 6-digit code"
              maxLength="6"
              className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300 text-center text-lg tracking-widest font-semibold"
            />
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={verifyLoading}
              className="w-full bg-emerald-700 cursor-pointer text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {verifyLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendLoading}
            className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {resendLoading ? 'Resending...' : 'Resend Code'} 
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterVerification;