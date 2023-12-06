import React, { useState, useEffect } from 'react'
import axios from 'axios'


const List = () => {
  const [urlList, setUrlList] = useState([])

  const API = 'http://localhost:5000'

  useEffect(() => {
    axios.get(`${API}/read`).then((response) => {
      setUrlList(response.data)
    });
  }, [])

  useEffect(() => {
    axios.get(`${API}/read`).then((response) => {
      setUrlList(response.data)
    });
  }, [urlList])

  function DateAnalysis(dateObject) {
      let date = JSON.stringify(dateObject)

      let year = date.slice(1, 5)
      let month = date.slice(6,8)
      let day = date.slice(9,11)
      let newMonth
      
      switch (month) {
        case "01":
          newMonth = "Jan";
          break;
        case "02":
          newMonth = "Feb";
          break;
        case "03":
          newMonth = "Mer";
          break;
        case "04":
          newMonth = "Apr";
          break;
        case "05":
          newMonth = "May";
          break;  
        case "06":
          newMonth = "Jun";
          break;
        case "07":
          newMonth = "Jul";
          break;
        case "08":
          newMonth = "Aug";
          break;
        case "09":
          newMonth = "Sep";
          break;
        case "10":
          newMonth = "Oct";
          break;              
        case "11":
          newMonth = "Nov";
          break;
        case "12":
          newMonth = "Dec";
          break;
          
          default:
              break;
      }
      return (newMonth + " " + day + ", " + year)
  }

  const deleteItem = (id) => {
    axios.delete(`${API}/delete/${id}`)
    
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">URL List</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Original URL</th>
            <th className="py-2 px-4 border-b">Short URL</th>
            <th className="py-2 px-4 border-b">Clicks</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {urlList.map((val, key) => (
            <tr key={key} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">
                <time>{DateAnalysis(val.date)}</time>
              </td>
              <td className="py-2 px-4 border-b">
                <a href={val.originalUrl} className="text-blue-500">
                  {val.originalUrl}
                </a>
              </td>
              <td className="py-2 px-4 border-b">
                <a href={`http://localhost:5000/${val.shortUrl}`} className="text-green-500">
                  {`http://localhost:5000/${val.shortUrl}`}
                </a>
              </td>
              <td className="py-2 px-4 border-b">
                <h3>{val.clicks}</h3>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => deleteItem(val._id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>  )
}

export default List
