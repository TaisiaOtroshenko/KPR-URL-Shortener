import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import '../style.css'

const NavBar = () => {
  const [activeBar, setActiveBar] = useState('home')

  useEffect(() => {
    const data = window.localStorage.getItem('activeBar')
    data ? setActiveBar(data) : setActiveBar('home')
  }, []);

  useEffect(() => {
    window.localStorage.setItem('activeBar', activeBar)
  }, [activeBar]);

  return (
    <>
      <header className="bg-blue-500 p-4">
        <h1 className="text-white text-2xl font-bold">URL Shortener</h1>
        <nav>
          <ul className="flex space-x-4 text-white mt-2">
            <li>
              <Link
                to="/"
                onClick={() => setActiveBar('home')}
                className={`hover:text-gray-300 ${activeBar === 'home' ? 'border-b-2 border-white' : ''}`}
              >
                Home
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>  )
}

export default NavBar
