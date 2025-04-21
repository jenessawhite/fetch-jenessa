import React, { useState } from 'react';

function LoginForm({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name.trim() || !email.trim()) {
      setError('Please enter both name and email');
      setIsLoading(false);
      return;
    }

    try {
      const success = await onLogin(name, email);
      if (!success) {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-stone-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-md">
        <h1>Fetch Your Mate!</h1>
        <p>Sign in to find your perfect dog mate!</p>

        {error && (
          <div className="bg-red-700 font-semibold p-1 mb-4 rounded text-stone-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <label htmlFor="name" className="block mb-2 font-medium text-slate-800">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full p-3 border rounded ${(error && !name) ? "border-red-600" : "border-stone-800"}`}
            />
          </div>

          <div className="mb-4 text-left">
            <label htmlFor="email" className="block mb-2 font-medium text-slate-800">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full p-3 border rounded ${(error && !email) ? "border-red-600" : "border-stone-800"}`}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;