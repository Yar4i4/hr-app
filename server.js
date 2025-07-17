const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

// Middleware для обработки CORS-ошибок
app.use(cors());

// Middleware для обработки JSON
app.use(express.json());

const dataFilePath = 'employees.json'; // Путь к файлу с данными

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
app.get('/employees', (req, res) => {
    const employees = readEmployeesFromFile();
    res.json(employees);
});

// Маршрут для поиска сотрудников по ФИО
app.get('/employees/search', (req, res) => {
    const query = req.query.q; // Получаем поисковый запрос из query parameters
    const employees = readEmployeesFromFile();
    const results = employees.filter(employee =>
        employee.fullName.toLowerCase().includes(query.toLowerCase())
    );
    res.json(results);
});

// Маршрут для добавления сотрудника
app.post('/employees', (req, res) => {
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

    if (writeEmployeesToFile(employees)) { // Записываем в файл
        console.log('Сотрудник успешно добавлен:', newEmployee);
        res.status(200).json(newEmployee); // Отправляем нового сотрудника в ответе
    } else {
        res.status(500).send('Ошибка при записи в файл.'); // Если не удалось записать
    }
});

// Запускаем сервер
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});