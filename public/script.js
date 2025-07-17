// public/script.js
const employeeList = document.getElementById('employeeList');
const searchInput = document.getElementById('searchInput');

// Определяем базовый URL для API в зависимости от окружения
const API_ENDPOINT = window.location.hostname.includes('netlify.app')
    ? '/.netlify/functions/employees'
    : 'http://localhost:3000';

console.log('API_ENDPOINT:', API_ENDPOINT); // Добавляем console.log

// Функция для отображения списка сотрудников
function displayEmployees(employees) {
    employeeList.innerHTML = ''; // Очищаем список
    employees.forEach(employee => {
        const li = document.createElement('li');
        li.textContent = `${employee.fullName} (${employee.position}, ${employee.department}, ${employee.contacts})`;
        employeeList.appendChild(li);
    });
}

// Функция для получения сотрудников с сервера
async function getEmployees() {
    try {
        const response = await fetch(API_ENDPOINT); // Исправлено: убрали /employees
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Ошибка получения сотрудников:', error);
        employeeList.textContent = 'Ошибка загрузки данных.';
    }
}

// Функция для поиска сотрудников
async function searchEmployees(query) {
    try {
        const response = await fetch(`${API_ENDPOINT}/search?q=${query}`); //  Исправлено:  оставили  только  /search
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Ошибка поиска сотрудников:', error);
        employeeList.textContent = 'Ошибка поиска.';
    }
}

// Обработчик события для поля поиска
searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim(); // Получаем значение из поля поиска и удаляем пробелы в начале и конце
        if (query) {
            searchEmployees(query); // Вызываем функцию поиска, если запрос не пустой
        } else {
            getEmployees(); // Если запрос пустой, отображаем всех сотрудников
        }
    });

    // Загружаем список сотрудников при загрузке страницы
    getEmployees();