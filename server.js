// server.js
const express = require('express');
const fs = require('fs'); // Модуль для работы с файловой системой
const app = express();
const port = process.env.PORT || 3000; // Порт для сервера

// Middleware для обработки CORS-ошибок
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешить запросы со всех доменов (ВНИМАНИЕ: в production нужно настроить более безопасно)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Маршрут для получения всех сотрудников
app.get('/employees', (req, res) => {
    fs.readFile('employees.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Ошибка чтения файла');
        }
        try {
            const employees = JSON.parse(data);
            res.json(employees);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Ошибка парсинга JSON');
        }
    });
});

// Маршрут для поиска сотрудников по ФИО
app.get('/employees/search', (req, res) => {
    const query = req.query.q; // Получаем поисковый запрос из query parameters
    fs.readFile('employees.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Ошибка чтения файла');
        }
        try {
            const employees = JSON.parse(data);
            const results = employees.filter(employee =>
                employee.fullName.toLowerCase().includes(query.toLowerCase())
            );
            res.json(results);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Ошибка парсинга JSON');
        }
    });
});

// Запускаем сервер
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});