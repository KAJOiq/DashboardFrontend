import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore'; 

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAppStore(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5091/api/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('token', data.user.token);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('roles', data.roles); 

        setToken(data.user.token);

        onLogin({
          username: data.user.username,
          email: data.user.email,
          token: data.user.token,
          roles: data.roles,
        });

        const roles = localStorage.getItem('roles');

      if (roles && roles.includes('Supervisor')) {
        navigate('/home');
      } else if (roles && roles.includes('Student')) {
        navigate('/home/show-projects');
      }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      setError('حدث خطأ. يرجى المحاولة لاحقًا.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800">تسجيل الدخول</h2>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400 text-right"
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400 text-right"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          تسجيل الدخول
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
