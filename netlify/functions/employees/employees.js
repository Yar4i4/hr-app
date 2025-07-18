const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const app = express();
const router = express.Router();

console.log("Вот  тот код");

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
    const employees = readEmployeesFromFile();
    res.json(employees);
});

router.get('/employees/search', (req, res) => {
    const query = req.query.q;
    const employees = readEmployeesFromFile();
    const results = employees.filter(employee =>
        employee.fullName.toLowerCase().includes(query.toLowerCase())
    );
    res.json(results);
});

router.post('/employees', (req, res) => {
    const { fullName, position, department, contacts } = req.body;
    if (!fullName || !position || !department || !contacts) {
        return res.status(400).send('Все поля обязательны для заполнения.');
    }

    const employees = readEmployeesFromFile();
    const maxId = employees.reduce((max, emp) => Math.max(max, emp.id), 0);
    const newId = maxId + 1;

    const newEmployee = { id: newId, fullName, position, department, contacts };
    employees.push(newEmployee);
    writeEmployeesToFile(employees);

    res.status(200).json(newEmployee);
});

app.use('/.netlify/functions/employees', router);

exports.handler = serverless(app);