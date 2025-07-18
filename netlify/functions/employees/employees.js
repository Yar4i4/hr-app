const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const router = express.Router();

router.use(cors());
router.use(express.json()); // <---  ВОТ ЭТО Я ПРОПУСТИЛ!

// Путь к файлу с данными (должен быть относительно директории функции)
const DB_FILE = path.join(__dirname, '../../../employees.json');

// Функция для чтения данных из файла
const readEmployeesFromFile = () => {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf-8');
            return JSON.parse(data);
        } else {
            return []; // Если файл не существует, возвращаем пустой массив
        }
    } catch (error) {
        console.error('Ошибка при чтении файла:', error);
        return []; // В случае ошибки возвращаем пустой массив
    }
};

// Функция для записи данных в файл
const saveEmployeesToFile = (employees) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(employees, null, 2));
    } catch (error) {
        console.error('Ошибка при записи файла:', error);
    }
};

router.get('/', (req, res) => {
    res.json({ message: "Используйте /employees для получения данных" });
});

router.get('/employees', (req, res) => {
    const employees = readEmployeesFromFile();
    res.json(employees);
});

router.get('/employees/search', (req, res) => {
    const query = req.query.q ? req.query.q.toLowerCase() : '';
    const employees = readEmployeesFromFile();
    const results = employees.filter(employee =>
        employee.fullName.toLowerCase().includes(query)
    );
    res.json(results);
});

router.post('/employees', (req, res) => {
    const { fullName, position, department, contacts } = req.body;
    if (!fullName || !position || !department || !contacts) {
        return res.status(400).json({ message: 'Все поля обязательны.' });
    }
    const employees = readEmployeesFromFile();
    const newEmployee = {
        id: Date.now(), // Генерируем ID на основе текущего времени
        fullName,
        position,
        department,
        contacts
    };
    employees.push(newEmployee);
    saveEmployeesToFile(employees);
    res.status(201).json(newEmployee);
});

router.delete('/employees/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        let employees = readEmployeesFromFile();
        const initialLength = employees.length;

        employees = employees.filter(emp => emp.id !== id);

        if (employees.length === initialLength) {
            return res.status(404).json({ 
                success: false,
                message: 'Сотрудник не найден' 
            });
        }

        saveEmployeesToFile(employees);
        res.setHeader('Content-Type', 'application/json');
        res.json({ 
            success: true,
            message: 'Сотрудник успешно удален',
            id: id
        });
    } catch (error) {
        console.error('Ошибка при удалении:', error);
        res.status(500).json({
            success: false,
            message: 'Внутренняя ошибка сервера'
        });
    }
});

app.use('/.netlify/functions/employees', router);

exports.handler = serverless(app);