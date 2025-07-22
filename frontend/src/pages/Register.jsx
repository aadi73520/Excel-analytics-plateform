import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    adminSecretKey: '',
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isAdmin = form.role === 'admin';
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      isAdmin,
      adminSecretKey: isAdmin ? form.adminSecretKey : undefined,
    };

    try {
      const res = await axios.post('/auth/register', payload);
      dispatch(setCredentials(res.data));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      if (res.data.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-6 py-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl transition-all duration-500">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        📝 Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Full Name"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
        />

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {form.role === 'admin' && (
          <input
            name="adminSecretKey"
            type="text"
            value={form.adminSecretKey}
            onChange={handleChange}
            placeholder="Admin Secret Key"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
          />
        )}

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
