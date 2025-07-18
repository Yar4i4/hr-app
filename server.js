const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// База данных
let employees = [];
const DB_FILE = 'employees.json';

// Загрузка данных при старте
if (fs.existsSync(DB_FILE)) {
  employees = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

// Маршруты API
app.get('/employees', (req, res) => {
  res.json(employees);
});

app.post('/employees', (req, res) => {
  const newEmployee = {
    id: Date.now(),
    ...req.body
  };
  employees.push(newEmployee);
  saveData();
  res.status(201).json(newEmployee);
});

// ИСПРАВЛЕННЫЙ обработчик удаления
app.delete('/employees/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const initialLength = employees.length;
    
    employees = employees.filter(emp => emp.id !== id);
    
    if (employees.length === initialLength) {
      return res.status(404).json({ 
        success: false,
        message: 'Сотрудник не найден' 
      });
    }
    
    saveData();
    
    // Явно указываем Content-Type
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

// Поиск сотрудников
app.get('/employees/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  const results = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(query)
  );
  res.json(results);
});

// Вспомогательная функция для сохранения данных
function saveData() {
  fs.writeFileSync(DB_FILE, JSON.stringify(employees, null, 2));
}

// Статические файлы
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});