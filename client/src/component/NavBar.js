import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavBar = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');


  useEffect(() => {
    // Fetch username without checking if token exists
    axios.get('http://localhost:5000/checkToken', {withCredentials:true})
      .then(response => {
        setUsername(response.data.username);
      })
      .catch(error => {
        // Handle error if the token is not valid or doesn't exist
        console.error('Error fetching username:', error);
      });
  }, []);  // Empty dependency array ensures this runs only once on component mount

  return (
    <header className="bg-blue-500 p-4 px-6">
      <div className="flex flex-row">
        <img className="w-8 h-8 mr-2" src="http://localhost:3000/icon.png" alt="icon"></img>
        <h1 className="text-white text-2xl font-bold">URL Shortener</h1>
      </div>
      <nav>
        <ul className="flex space-x-4 text-white mt-2 ">
          <li>
            <Link to="/" onClick={() => navigate('/')} className='hover:text-gray-300 hover:underline mr-3'>
              Главная
            </Link>

            {username ? (
              // If username exists, display username and a logout link
              <>
                <span className='text-white-300 mr-3 font-semibold' >Пользователь: {username}</span>
                <Link to="/login" onClick={() => {
                  axios.post('http://localhost:5000/logout', {}, {withCredentials:true})
                  setUsername('');
                }} className='hover:text-gray-300 hover:underline mr-3'>
                  Выйти
                </Link>
              </>
            ) : (
              // If username doesn't exist, display login and register links
              <>
                <Link to="/login" onClick={() => navigate('/login')} className='hover:text-gray-300 hover:underline mr-3'>
                  Вход
                </Link>
                <Link to="/register" onClick={() => navigate('/register')} className='hover:text-gray-300 hover:underline mr-3'>
                  Регистрация 
                </Link>
              </>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
