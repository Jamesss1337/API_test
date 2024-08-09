const express = require('express');
   const usersRouter = require('./routes/users');

   const app = express();
   app.use(express.json());
   app.use('/user', usersRouter);

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
       console.log(`Сервер запущен на порту ${PORT}`);
   });