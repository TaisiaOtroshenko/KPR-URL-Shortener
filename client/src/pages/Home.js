import React from 'react';

const Home = () => {
  return (
    <div className="intro">
      <h1>Добро пожаловать в мое приложение для сокращения URL</h1>
      <h2>Как это работает?</h2>
      <p>
        Предоставив действительный URL, приложение сгенерирует для него уникальный идентификатор.<br />
        Если вы решите сохранить его, будет создан короткий URL путем добавления уникального идентификатора к домену сервера Node.js<br />
        [SERVER_DOMAIN:"localhost:5000"/UNIQE_ID]<br />
        После доступа к короткому URL сервер перенаправит нас на оригинальный URL.<br />
        Приложение также подсчитывает количество посещений короткого URL и отображает его в списке сохраненных адресов.<br />
        Нажмите на <span style={{ color: '#00bbf0' }}>New</span>, чтобы создать новый короткий URL.<br />
        Нажмите на <span style={{ color: '#00bbf0' }}>List</span>, чтобы просмотреть список сохраненных URL.<br />
        Сделано <span style={{ fontStyle: 'oblique', textDecoration: 'underline' }}>Иван Иванов</span>
      </p>
    </div>
  );
};

export default Home;

