import { useState } from 'react';
import Header from '../components/Header';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', gender: '', dob: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.username || !form.email || !form.password || !form.gender || !form.dob) {
      setError('Please fill in all required fields.');
      return;
    }

    // Mock submit (replace with real API call)
    setTimeout(() => {
      setSuccess('Registration successful (mock).');
      setForm({ username: '', email: '', password: '', gender: '', dob: '' });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <Header />
      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-6 mt-20">
        <h1 className="text-2xl font-semibold text-emerald-800">Create an account</h1>
        <p className="text-sm text-gray-600 mt-1">Sign up to register your mosque or join the community.</p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-emerald-700">{success}</div>}

          <label className="block">
            <span className="text-gray-700 text-sm">Username</span>
            <input name="username" value={form.username} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Your name" />
          </label>

          <label className="block">
            <span className="text-gray-700 text-sm">Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="you@example.com" />
          </label>

          <label className="block">
            <span className="text-gray-700 text-sm">Password</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Enter a strong password" />
          </label>

          <div className="flex gap-4">
            <label className="flex-1">
              <span className="text-gray-700 text-sm">Gender</span>
              <select name="gender" value={form.gender} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300">
                <option value="">Select</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="w-40">
              <span className="text-gray-700 text-sm">Date of birth</span>
              <input name="dob" type="date" value={form.dob} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" />
            </label>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-emerald-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800">Sign Up</button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4">By signing up you agree to our terms and privacy policy. This is a mock signup form for demo purposes.</p>
      </div>
    </div>
  );
};

export default Signup;
