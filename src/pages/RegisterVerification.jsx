import { useState } from 'react';
import publicAxiosInstance from '../../auth/publicAxiosInstance';
import { useLocation, useNavigate } from 'react-router-dom';

const RegisterVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const location = useLocation();

const registeredEmail = location.state?.email || '';

  const handleChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!verificationCode || verificationCode.trim() === '') {
      setError('Please enter the verification code.');
      setLoading(false);
      return;
    }

    const body = {
      verificationCode: verificationCode.trim()
    };
    
    try {
      const res = await publicAxiosInstance.post('/verifications/verify', body);
      if (res.status < 400) {
        console.log('Verification response:', res.data);
        setSuccess(`Success: ${res.data.message || 'Email verified successfully!'}`);
        setVerificationCode('');
        setLoading(false); 
        navigate('/');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout - server is not responding. Please try again.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid verification code.');
      } else if (err.response?.status === 404) {
        setError('Verification endpoint not found.');
      } else {
        setError('Failed to verify email: ' + (err.response?.data?.message || err.message));
      }
      console.error('Verification error:', err.response?.data?.message);
      setLoading(false);
      return;
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await publicAxiosInstance.post('/auths/resend-code');
      if (res.status < 400) {
        setSuccess('Verification code sent to your email.');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError('Failed to resend code: ' + (err.response?.data?.message || err.message));
      console.error('Resend code error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6 mt-20">
      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-6 ">
        <h1 className="text-2xl font-semibold text-emerald-800">Verify Your Email</h1>
        <p className="text-sm text-gray-600 mt-1">Enter the verification code we sengt to your email address.</p>

        {/* Mock email display - will be replaced with user email from state */}
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
              disabled={loading}
              className="w-full bg-emerald-700 cursor-pointer text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
          <button
            type="button"
            onClick={handleResendCode}
            disabled={loading}
            className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            Resend Verification Code
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          This is a verification page for email confirmation. Check your inbox for the code we sent.
        </p>
      </div>
    </div>
  );
};

export default RegisterVerification;
