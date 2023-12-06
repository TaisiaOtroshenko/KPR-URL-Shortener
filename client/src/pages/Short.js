import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Short = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [message, setMessage] = useState('');

  const API = 'http://localhost:5000';

  useEffect(() => {
    fetchUrlList();
  }, []);

const fetchUrlList = async () => {
    try {
      const response = await axios.get(`${API}/read`);
      setUrlList(response.data);
    } catch (error) {
      console.error('Ошибка при получении списка URL:', error);
    }
  };

  const generateAndSaveUrl = async () => {
    try {
      if (originalUrl.startsWith('http', 0)) {
        const generateResponse = await axios.post(`${API}/generate`, { originalUrl });
        const urlId = generateResponse.data;

        if (urlId) {
          await axios.post(`${API}/insert`, {
            originalUrl: originalUrl,
            shortUrl: urlId,
          }).catch(e => console.log(e));
          setMessage('URL успешно сгенерирован и сохранен');
          setOriginalUrl('');
          fetchUrlList(); // Обновить список после сохранения
        } else {
          setMessage('Не удалось сгенерировать идентификатор URL');
        }
      } else {
        setMessage('Неверный URL');
      }
    } catch (error) {
      console.error('Ошибка при генерации или сохранении URL:', error);
      setMessage('Ошибка при генерации или сохранении URL');
    }
  };

  const deleteItem = async (id) => {
    try {
      axios.post(`${API}/delete/${id}`);
      fetchUrlList(); // Обновить список после удаления
    } catch (error) {
      console.error('Ошибка при удалении URL:', error);
    }
  };

  const DateAnalysis = (dateObject) => {
    const date = JSON.stringify(dateObject);
    const year = date.slice(1, 5);
    const month = date.slice(6, 8);
    const day = date.slice(9, 11);
    const monthNames = [
      'Янв', 'Фев', 'Мар', 'Апр', 'Мая', 'Июн',
      'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
    ];
    const newMonth = monthNames[parseInt(month, 10) - 1];
    return `${newMonth} ${day}, ${year}`;
  };

  return (
    <div className="app">
      <div className="section mb-4">


<div class="mb-6 mt-8">

    <div className='flex justify-items-center'>

    <input type="text" id="default-input" class= "place-self-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Ссылка' value={originalUrl}
                    onChange={e => setOriginalUrl(e.target.value)} />

        <button onClick={generateAndSaveUrl} type="button" class="place-self-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-2 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Укоротить</button>


    </div>
</div>

      </div>
      <div className={message ? 'message bg-yellow-100 p-2 rounded' : ''}>
        {message && <h3 className="text-yellow-800">{message}</h3>}
      </div>

      <h1 className="text-3xl font-bold mb-4">URL List</h1>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>



            <tr>
                <th scope="col" className="px-6 py-3">
                    Дата создания
                </th>
                <th scope="col" className="px-6 py-3">
                    Орининальное url
                </th>
                <th scope="col" className="px-6 py-3">
                    Укороченное url
                </th>
                <th scope="col" className="px-6 py-3">
                    Просмотры
                </th>
                <th scope="col" className="px-6 py-3">
                    Удаление
                </th>
            </tr>



        </thead>
        <tbody>
          {urlList.map((val, key) => (
            <tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="py-6 px-4 border-b">
                <time>{DateAnalysis(val.date)}</time>
              </td>
              <td className="py-6 px-4 border-b">
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
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Short;
