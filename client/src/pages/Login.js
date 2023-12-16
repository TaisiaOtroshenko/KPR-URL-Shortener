import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const API = 'http://localhost:5000';

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API}/login`, {
        username,
        password,
      }, { withCredentials: true });

      if (response.status === 200) {
        //navigate("/");
        window.location.href = '/';
      } else {
        setMessage('Неверное имя пользователя или пароль');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Ошибка при входе');
    }
  };

  return (
    <div className="app">
      <div className="section mb-4">
        <h1 className="text-3xl font-bold mb-4">Вход</h1>
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
          placeholder="Введите логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-2 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 px-4"

        >
          Войти
        </button>
        {message && <div className="text-red-500 mt-2">{message}</div>}
      </div>
    </div>
  );
};

export default Login;
