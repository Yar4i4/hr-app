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
        console.log('Чтение из /tmp/employees.json')
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
        console.log('Запись в /tmp/employees.json', employees)
        fs.writeFileSync(dataFilePath, JSON.stringify(employees, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Ошибка записи файла:', error);
        return false;
    }
};

// Маршрут для получения всех сотрудников
router.get('/employees', (req, res) => {
    console.log('GET /employees');
    const employees = readEmployeesFromFile();
    res.json(employees);
});

// Маршрут для поиска сотрудников по ФИО
router.get('/employees/search', (req, res) => {
    console.log('GET /employees/search', req.query);
    const query = req.query.q; // Получаем поисковый запрос из query parameters
    const employees = readEmployeesFromFile();
    const results = employees.filter(employee =>
        employee.fullName.toLowerCase().includes(query.toLowerCase())
    );
    res.json(results);
});

// Маршрут для добавления сотрудника
router.post('/employees', (req, res) => {
    console.log('POST /employees', req.body);
    const { fullName, position, department, contacts } = req.body;

    // Простая валидация (проверка наличия всех полей)
    if (!fullName || !position || !department || !contacts) {
        return res.status(400).send('Все поля обязательны для заполнения.');
    }

    const employees = readEmployeesFromFile(); // Читаем текущих сотрудников
    const maxId = employees.reduce((max, emp) => Math.max(max, emp.id), 0); // Находим максимальный id
    const newId = maxId + 1; // Генерируем новый id

    const newEmployee = {
        id: newId,
        fullName,
        position,
        department,
        contacts
    };

    employees.push(newEmployee); // Добавляем сотрудника в список
    writeEmployeesToFile(employees);

    res.status(200).json(newEmployee); // Отправляем нового сотрудника в ответе
    
});

app.use('/.netlify/functions/employees', router);

exports.handler = serverless(app);