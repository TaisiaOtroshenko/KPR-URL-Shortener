import React from 'react';

const Home = () => {
  return (

<div className="intro  p-8 bg-blue-100 dark:bg-blue-800">
  <h1 className="text-4xl text-center font-bold text-blue-700 dark:text-blue-300 mb-4">
    Добро пожаловать в приложение для сокращения URL
  </h1>
  <h2 className="text-2xl  text-center font-semibold text-blue-700 dark:text-blue-300 mb-2">
    Как работает?
  </h2>
  <p className="text-lg text-gray-700 dark:text-gray-300">
    Предоставив действительный URL, приложение сгенерирует для него уникальный идентификатор.
    <br />
    Если вы решите сохранить его, будет создан короткий URL путем добавления уникального идентификатора к домену.
    <br />
    При переходе по короткому URL сервер перенаправлит на оригинальный URL.
    <br />
    Приложение также подсчитывает количество посещений короткого URL и отображает их в списке сохраненных адресов. 
    <br />
    Кроме этого у нас есть возможность указания тегов и фильтрация по ним. Этот функционал доступен лишь зарегестированным пользователям.
  </p>
</div>

  );
};

export default Home;

