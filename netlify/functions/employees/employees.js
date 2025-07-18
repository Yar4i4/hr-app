const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();
const router = express.Router();

router.use(cors());
router.use(express.json());

const readEmployeesFromFile = () => {
    console.log('Чтение сотрудников из переменной (заглушка)');
    const defaultEmployees = [
        { "id": 1, "fullName": "Иванов Иван Иванович", "position": "Разработчик", "department": "IT", "contacts": "ivanov@example.com" },
        { "id": 2, "fullName": "Петрова Анна Сергеевна", "position": "Менеджер", "department": "Продажи", "contacts": "petrova@example.com" },
        { "id": 3, "fullName": "Сидоров Сергей Петрович", "position": "Дизайнер", "department": "Маркетинг", "contacts": "sidorov@example.com" }
    ];
    return JSON.parse(JSON.stringify(defaultEmployees)); // Возвращаем копию
};

const writeEmployeesToFile = (employees) => {
    console.log('Запись сотрудников в файл (заглушка):', JSON.stringify(employees));
    return true; // Всегда возвращаем true
};

router.get('/employees', (req, res) => {
    console.log('GET /employees');
    const employees = readEmployeesFromFile();
    res.json(employees);
});

router.get('/employees/search', (req, res) => {
    console.log('GET /employees/search', req.query);
    const query = req.query.q; // Получаем поисковый запрос из query parameters
    const employees = readEmployeesFromFile();
    const results = employees.filter(employee =>
        employee.fullName.toLowerCase().includes(query.toLowerCase())
    );
    res.json(results);
});

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