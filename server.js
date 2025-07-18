// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.json()); // 👈 Добавляем middleware для обработки JSON



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const employeesFilePath = path.join(__dirname, 'employees.json');

app.get('/employees', (req, res) => {
    fs.readFile(employeesFilePath, 'utf8', (err, data) => {
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

app.get('/employees/search', (req, res) => {
    const query = req.query.q;
    fs.readFile(employeesFilePath, 'utf8', (err, data) => {
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

app.post('/employees', (req, res) => { // 👈 Обработчик POST-запроса
    const newEmployee = req.body;
    fs.readFile(employeesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Ошибка чтения файла');
        }
        try {
            const employees = JSON.parse(data);
            newEmployee.id = Date.now();
            employees.push(newEmployee);
            fs.writeFile(employeesFilePath, JSON.stringify(employees, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Ошибка записи в файл');
                }
                res.status(201).json(newEmployee);
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send('Ошибка парсинга JSON');
        }
    });
});




app.delete('/employees/:id', (req, res) => { // 👈  Новый маршрут для DELETE
    const id = parseInt(req.params.id); // 👈  Получаем ID из параметров URL
    fs.readFile(employeesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Ошибка чтения файла');
        }
        try {
            let employees = JSON.parse(data);
            employees = employees.filter(employee => employee.id !== id); // 👈 Удаляем сотрудника
            fs.writeFile(employeesFilePath, JSON.stringify(employees, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Ошибка записи в файл');
                }
                res.status(204).send(); // 👈 Отправляем 204 No Content
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send('Ошибка парсинга JSON');
        }
    });
});












app.use(express.static(path.join(__dirname, 'public')));



app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});