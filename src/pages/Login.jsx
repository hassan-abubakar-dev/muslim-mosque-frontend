import { useState } from 'react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
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

    if (!form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }

    // Mock submit (replace with real API call)
    setTimeout(() => {
      setSuccess('Login successful (mock).');
      setForm({ email: '', password: '' });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-lg p-6 mt-20">
        <h1 className="text-2xl font-semibold text-emerald-800">Log In</h1>
        <p className="text-sm text-gray-600 mt-1">Enter your credentials to access your account.</p>

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
            <button type="submit" className="w-full bg-emerald-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800">Log In</button>
          </div>
        </form>

        <p className="text-xs text-gray-500 mt-4">This is a mock login form for demo purposes.</p>
      </div>
    </div>
  );
};

export default Login;
