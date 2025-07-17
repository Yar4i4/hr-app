const express = require('express');
const fs = require('fs');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
const router = express.Router();

// Middleware для обработки CORS-ошибок
router.use(cors());

// Middleware для обработки JSON
router.use(express.json());

const dataFilePath = '/tmp/employees.json'; // Временный путь для Netlify Functions

// Функция для чтения данных из файла
const readEmployeesFromFile = () => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Ошибка чтения файла:', error);
        return [];
    }
};

// Функция для записи данных в файл
const writeEmployeesToFile = (employees) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(employees, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Ошибка записи файла:', error);
        return false;
    }
};

// Маршрут для получения всех сотрудников
router.get('/employees', (req, res) => {
    const employees = readEmployeesFromFile();
    res.json(employees);
});

// Маршрут для поиска сотрудников по ФИО
router.get('/employees/search', (req, res) => {
    const query = req.query.q; // Получаем поисковый запрос из query parameters
    const employees = readEmployeesFromFile();
    const results = employees.filter(employee =>
        employee.fullName.toLowerCase().includes(query.toLowerCase())
    );
    res.json(results);
});

// Маршрут для добавления сотрудника
router.post('/employees', (req, res) => {
    const { fullName, position, department, contacts } = req.body;

    // Простая валидация (проверка наличия всех полей)
    if (!fullName || !position ||