import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const API = 'http://localhost:5000';

  const handleRegister = async () => {
    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        setMessage('Пароли не совпадают');
        return;
      }

      const response = await axios.post(`${API}/register`, {
        username,
        password,
      });

      if (response.status === 201) {
        setMessage('Успешная регистрация');
        navigate('/login');
        // Redirect or perform additional actions upon successful registration
      } else {
        setMessage('Error during registration');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Произошла ошибка при регистрации');
    }
  };

  return (
    <div className="app">
      <div className="section mb-4">
        <h1 className="text-3xl font-bold mb-4">Регистрация</h1>
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
        <input
          type="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-4"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-2 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 px-4"
        >
          Зарегестироваться
        </button>
        {message && <div className="text-red-500 mt-2">{message}</div>}
      </div>
    </div>
  );
};

export default Register;
