import React, { useState } from 'react'
import axios from 'axios'


const New = () => {
    const [originalUrl, setOriginalUrl] = useState('')
    const [urlId, setUrlId] = useState('')
    const [message, setMessage] = useState('')

    const API = 'http://localhost:5000'

    const generateUrl = async () => {               
        let response = ''

        if(originalUrl.startsWith('http',0)) {
            response = await axios.post(`${API}/generate`, { originalUrl: originalUrl });
        } else setMessage('Failed to generate a URL Id - make sure you entered a valid URL') 
        
        if(response.data) {
            setUrlId(response.data)
            setMessage('A URL Id has created successfully') 
        } else {
            setMessage('Failed to generate a URL Id - make sure you entered a valid URL')
        }
    }
    

    const saveToDB = () => {
        if(urlId) {
            axios.post(`${API}/insert`, {
                originalUrl: originalUrl,
                shortUrl: urlId
            });
        } 
        setOriginalUrl("")
        setUrlId("")
        setMessage("")
    }


    return (
    <div className="app">
      <div className="section mb-4">
        <label className="block mb-2">URL</label>
        <input
          id="urlInput"
          type="text"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Please insert a valid URL"
          className="border p-2 w-full"
        />
        <button
          onClick={() => generateUrl()}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-2 hover:bg-blue-700"
        >
          Shortify
        </button>
      </div>
      <div className="section mb-4">
        <label className="block mb-2">Result</label>
        <input
          type="text"
          id="urlId"
          value={urlId}
          placeholder="A unique id will be generated and displayed here"
          readOnly
          className="border p-2 w-full"
        />
        <button
          onClick={() => saveToDB()}
          className="bg-green-500 text-white py-2 px-4 rounded mt-2 hover:bg-green-700"
        >
          Save to Database
        </button>
      </div>
      <div className={message ? 'message bg-yellow-100 p-2 rounded' : ''}>
        {message ? <h3 className="text-yellow-800">{message}</h3> : <></>}
      </div>
    </div>
    )
}

export default New
