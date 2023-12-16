import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Short = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState('');

 const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTag, setSearchTag] = useState([]);



  const API = 'http://localhost:5000';

  useEffect(() => {
    axios.get(`${API}/checkToken`, {withCredentials:true})
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));

  }, []);

  useEffect(() => {
    fetchUrlList();
    const intervalId = setInterval(fetchUrlList, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [searchTag]);

  const fetchUrlList = async () => {
    try {
      const response = await axios.post(`${API}/search`, {
        tags: searchTag.join(),
      });
      setUrlList(response.data);
    } catch (error) {
      console.error('Error fetching URL list:', error);
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
            tags: tags,
          }).catch(e => console.log(e));
          setMessage('URL успешно сгенерирован и сохранен');
          setOriginalUrl('');
          setTags('');

          setTimeout(() => {
            setMessage('');
          }, 3000);

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

          setTimeout(() => {
            setMessage('');
          }, 5000);
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


  const handleAddTagClick = (tag) => {
    //console.log( 'tag ' + tag );
    //console.log( 'array ' +searchTag.join() );
    //console.log( 'condition ' + searchTag.find((x)=>x===tag ) )
    if( ( searchTag.find((x)=>x===tag ) === undefined ) ){
      setSearchTag( [...searchTag, tag] );
    }
  }

  const handleDelTagClick = ( tag ) => {
    if( searchTag.indexOf( tag ) !== -1 ){
      let index = searchTag.indexOf( tag );
      setSearchTag([ ...searchTag.slice(0, index), 
        ...searchTag.slice(index + 1) ]);
    }

  }


  return (
    <div className="app">
      <div className="section mb-4">



<div className="mb-6 mt-8">
  <div className="flex justify-items-center">
    <input
      type="text"
      id="default-input"
      className="place-self-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mr-4"
      placeholder="Ссылка"
      value={originalUrl}
      onChange={(e) => setOriginalUrl(e.target.value)}
    />
    <input
      type="text"
      id="tags-input"
      className="place-self-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
      placeholder="Теги (через запятую)"
      value={tags}
      onChange={(e) => setTags(e.target.value)}
    />
    <button
      onClick={generateAndSaveUrl}
      type="button"
      className="place-self-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-2 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mx-4"
    >
      Укоротить
    </button>

  </div>
</div>


      </div>
      <div className={message ? 'message bg-yellow-100 p-2 rounded mb-3' : ''}>
        {message && <h3 className="text-yellow-800">{message}</h3>}
      </div>


      <div className='ml-5 mb-3'>
      { searchTag  && searchTag.map((tag, index) =>(
        <span key={index} id="badge-dismiss-default" className="inline-flex items-center px-2 py-1 me-2 text-sm font-medium text-blue-800 bg-blue-100 rounded dark:bg-blue-900 dark:text-blue-300">
        { '#'+tag } 
        <button type="button" className="inline-flex items-center p-1 ms-2 text-sm text-blue-400 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300" data-dismiss-target="#badge-dismiss-default" aria-label="Remove" onClick={()=>{  handleDelTagClick(tag)  } }>
        <svg className="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
        <span className="sr-only">Удалить тег</span>
        </button>
        </span>

      ))}
      </div>



      <h1 className="text-3xl font-bold mb-4">URL List</h1>

      <div className='overflow-x-auto'>

      { urlList.length > 0 ? (
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>


<tr>
    <th scope="col" className="px-3 py-3">
      Дата создания
    </th>
    <th scope="col" className="px-6 py-3">
      Орининальное url
    </th>
    <th scope="col" className="pl-6 py-3">
      Укороченное url
    </th>

              {/* Conditionally render Теги column if user is logged in */}
              {isLoggedIn && (
                <th scope="col" className="pr-2 py-3 text-center">
                  Теги
                </th>
              )}

              {/* Conditionally render Просмотры column if user is logged in */}
              {isLoggedIn && (
                <th scope="col" className="px-1 py-3">
                  Просмотры
                </th>
              )}

    <th scope="col" className="px-6 py-3">
      Удаление
    </th>
</tr>


        </thead>
        <tbody>
          {urlList.map((val, key) => (
            <tr key={key} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="py-3 px-4 border-b">
                <time>{DateAnalysis(val.date)}</time>
              </td>
              <td className="py-6 px-4 border-b">
                <a href={val.originalUrl} className="text-blue-500 text-xs">
                  {val.originalUrl}
                </a>
              </td>
              <td className="py-2 px-4 border-b ">
                <a href={`http://localhost:5000/${val.shortUrl}`} className="text-green-500 text-xs ">
                  {`http://localhost:5000/${val.shortUrl}`}
                </a>
              </td>


                {/* Conditionally render Теги column if user is logged in */}
                {isLoggedIn && (
                  <td className="py-1 px-4 border-b">
                    {val.tags && val.tags.split(',').map((tag, index) => (
                      <button key={index} className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 hover:underline " onClick={() => {handleAddTagClick(tag)}}>#{tag}</button>
                    ))}
                  </td>
                )}

                {/* Conditionally render Просмотры column if user is logged in */}
                {isLoggedIn && (
                  <td className="py-2 px-4 border-b">
                  <div className='flex flex-row content-center'>
                    <h3 className='text-lg item-center mr-1'>{val.clicks}</h3>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="self-center w-6 h-6">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                    </svg>

                  </div>
                  </td>
                )}


              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => deleteItem(val.shortUrl)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> ) : ( <div className='text-gray-500'>Пока не добавлено ни одной ссылки</div> ) }
      </div>
    </div>
  );
};

export default Short;
