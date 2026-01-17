import { useState } from 'react';
import Header from '../components/Header';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2, 11);
};

const RegisterMosque = () => {
  const [form, setForm] = useState({ name: '', country: '', state: '', local_government: '', description: '', is_verified: false });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.country || !form.state || !form.local_government) {
      setError('Please fill in all required fields (name, country, state, local government).');
      return;
    }

    const now = new Date().toISOString();
    const newMosque = {
      id: generateId(),
      name: form.name,
      country: form.country,
      state: form.state,
      local_government: form.local_government,
      description: form.description || null,
      is_verified: !!form.is_verified,
      created_at: now,
      updated_at: now,
    };

    // Save to localStorage as a mock DB
    try {
      const stored = JSON.parse(localStorage.getItem('mosques') || '[]');
      stored.push(newMosque);
      localStorage.setItem('mosques', JSON.stringify(stored));
      setSuccess('Mosque registered (mock).');
      setForm({ name: '', country: '', state: '', local_government: '', description: '', is_verified: false });
    } catch (err) {
      setError('Failed to save mosque.');
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
        <Header />
      <div className="w-full max-w-2xl bg-white/95 rounded-xl shadow-lg p-6 mt-20">
        <h1 className="text-2xl font-semibold text-emerald-800">Register Mosque</h1>
        <p className="text-sm text-gray-600 mt-1">Fill in mosque information. This stores data locally (mock database).</p>

        <form className="mt-5 grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-emerald-700">{success}</div>}

          <label className="block">
            <span className="text-gray-700 text-sm">Name *</span>
            <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Mosque name" />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label>
              <span className="text-gray-700 text-sm">Country *</span>
              <input name="country" value={form.country} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Country" />
            </label>
            <label>
              <span className="text-gray-700 text-sm">State *</span>
              <input name="state" value={form.state} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="State / Province" />
            </label>
          </div>

          <label>
            <span className="text-gray-700 text-sm">Local Government *</span>
            <input name="local_government" value={form.local_government} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" placeholder="Local government / municipality" />
          </label>

          <label>
            <span className="text-gray-700 text-sm">Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300" rows="4" placeholder="Short description or notes" />
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" name="is_verified" checked={form.is_verified} onChange={handleChange} className="w-4 h-4" />
            <span className="text-sm text-gray-700">Verified</span>
          </label>

          <div className="flex items-center gap-3">
            <button type="submit" className="bg-emerald-700 text-white px-4 py-2 rounded-md font-semibold hover:bg-emerald-800">Register Mosque</button>
            <button type="button" onClick={() => { setForm({ name: '', country: '', state: '', local_government: '', description: '', is_verified: false }); setError(''); setSuccess(''); }} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md">Reset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterMosque;
