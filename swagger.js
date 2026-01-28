// swagger.js
const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  info: {
    title: 'URLShortener',
    description: 'Учебный сервис для создания коротких ссылок',
  },
  host: 'https://urlshortener-server-vosa.onrender.com/', // Укажите ваш хост и порт
  schemes: ['https'],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'https',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  }, 
  security: [],
  tags: [
    {
      name: 'Auth',
      description: 'Эндпоинты для регистрации и логина'
    },
    {
      name: 'URLs',
      description: 'Операции с сокращением ссылок'
    },
    {
      name: 'Admin',
      description: 'Панель управления для администраторов'
    },
    {
      name: 'Redirect',
      description: 'Перенаправление по кооткой ссылке'
    }
  ]
};

const outputFile = './swagger-output.json'; // Куда сохранить результат
const endpointsFiles = ['./index.js']; // Ваш входной файл

/* ЗАПУСК ГЕНЕРАЦИИ */
swaggerAutogen(outputFile, endpointsFiles, doc).then(({ data }) => {
  // data — это объект, который будет записан в JSON
  if (data && data.paths) {
    Object.values(data.paths).forEach(path => {
      Object.values(path).forEach(method => {
        if (method.parameters) {
          // Фильтруем параметры, удаляя те, что называются 'authorization'
          method.parameters = method.parameters.filter(
            param => param.name.toLowerCase() !== 'authorization'
          );
        }
      });
    });
  }
  // Перезаписываем файл очищенными данными
  const fs = require('fs');
  fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

  require('./index.js');
  });