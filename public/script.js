const employeeList = document.getElementById('employeeList');
const searchInput = document.getElementById('searchInput');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const addEmployeeForm = document.getElementById('addEmployeeForm');
const saveEmployeeBtn = document.getElementById('saveEmployeeBtn');
const cancelAddBtn = document.getElementById('cancelAddBtn');

// Определяем базовый URL для API
const API_ENDPOINT = window.location.hostname.includes('netlify.app')
    ? '/.netlify/functions/employees' // Для Netlify
    : 'http://localhost:3000/employees'; // Для локального сервера

console.log('API_ENDPOINT:', API_ENDPOINT);

// Функция для отображения списка сотрудников
function displayEmployees(employees) {
    employeeList.innerHTML = '';
    
    if (employees.length === 0) {
        employeeList.innerHTML = '<li>Сотрудники не найдены</li>';
        return;
    }

    employees.forEach(employee => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${employee.fullName}</strong><br>
            Должность: ${employee.position}<br>
            Отдел: ${employee.department}<br>
            Контакты: ${employee.contacts}
        `;
        employeeList.appendChild(li);
    });
}

// Функция для получения сотрудников
async function getEmployees() {
    try {
        const response = await fetch(API_ENDPOINT);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Ошибка получения сотрудников:', error);
        employeeList.innerHTML = '<li style="color: red;">Ошибка загрузки данных. Пожалуйста, обновите страницу.</li>';
    }
}

// Функция для поиска сотрудников
async function searchEmployees(query) {
    try {
        const response = await fetch(`${API_ENDPOINT}/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Ошибка поиска сотрудников:', error);
        employeeList.innerHTML = '<li style="color: red;">Ошибка поиска. Пожалуйста, попробуйте снова.</li>';
    }
}

// Показать форму добавления
addEmployeeBtn.addEventListener('click', () => {
    addEmployeeForm.style.display = 'block';
});

// Скрыть форму добавления
cancelAddBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addEmployeeForm.style.display = 'none';
});

// Обработчик сохранения сотрудника
saveEmployeeBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // Получаем значения полей
    const fullName = document.getElementById('fullName').value.trim();
    const position = document.getElementById('position').value.trim();
    const department = document.getElementById('department').value.trim();
    const contacts = document.getElementById('contacts').value.trim();

    // Валидация
    if (!fullName) {
        alert('Поле "ФИО" обязательно для заполнения!');
        return;
    }

    // Создаем объект сотрудника
    const newEmployee = {
        fullName,
        position: position || 'Не указано',
        department: department || 'Не указано',
        contacts: contacts || 'Не указано'
    };

    try {
        // Отправляем запрос
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEmployee)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Очищаем форму
        document.getElementById('fullName').value = '';
        document.getElementById('position').value = '';
        document.getElementById('department').value = '';
        document.getElementById('contacts').value = '';

        // Скрываем форму
        addEmployeeForm.style.display = 'none';

        // Обновляем список
        await getEmployees();
        
        // Показываем уведомление
        alert('Сотрудник успешно добавлен!');
        
    } catch (error) {
        console.error('Ошибка при добавлении сотрудника:', error);
        alert('Произошла ошибка при добавлении сотрудника. Пожалуйста, попробуйте снова.');
    }
});

// Обработчик поиска
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchEmployees(query);
    } else {
        getEmployees();
    }
});

// Загружаем данные при старте
document.addEventListener('DOMContentLoaded', () => {
    getEmployees();
});