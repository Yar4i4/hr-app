// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE'); // 👈 Добавил DELETE
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


app.use(express.json()); //  Добавляем middleware для обработки JSON


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});