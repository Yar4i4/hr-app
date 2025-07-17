const employeeList = document.getElementById('employeeList');
const searchInput = document.getElementById('searchInput');
const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const addEmployeeForm = document.getElementById('addEmployeeForm');
const saveEmployeeBtn = document.getElementById('saveEmployeeBtn');
const cancelAddBtn = document.getElementById('cancelAddBtn');

// Определяем базовый URL для API в зависимости от окружения
const API_ENDPOINT = window.location.hostname.includes('netlify.app')
    ? '' // Для Netlify используем относительный URL
    : 'http://localhost:3000';

console.log('API_ENDPOINT:', API_ENDPOINT);

// Функция для отображения списка сотрудников
function displayEmployees(employees) {
    employeeList.innerHTML = '';
    employees.forEach(employee => {
        const li = document.createElement('li');
        li.textContent = `${employee.fullName} (${employee.position}, ${employee.department}, ${employee.contacts})`;
        employeeList.appendChild(li);
    });
}

// Функция для получения сотрудников с сервера
async function getEmployees() {
    try {
        const response = await fetch(`${API_ENDPOINT}/employees`);
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
        const response = await fetch(`${API_ENDPOINT}/employees/search?q=${query}`);
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Ошибка поиска сотрудников:', error);
        employeeList.textContent = 'Ошибка поиска.';
    }
}

// Показать форму добавления сотрудника
addEmployeeBtn.addEventListener('click', () => {
    addEmployeeForm.style.display = 'block';
});

// Скрыть форму добавления сотрудника
cancelAddBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addEmployeeForm.style.display = 'none';
});

// Обработчик для кнопки "Сохранить"
saveEmployeeBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    // Получаем значения из полей формы
    const fullName = document.getElementById('fullName').value.trim();
    const position = document.getElementById('position').value.trim();
    const department = document.getElementById('department').value.trim();
    const contacts = document.getElementById('contacts').value.trim();

    // Создаем объект с данными нового сотрудника
    const newEmployee = {
        fullName,
        position,
        department,
        contacts
    };

    try {
        // Отправляем POST-запрос к API
        const response = await fetch(`${API_ENDPOINT}/employees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEmployee)
        });

        if (response.ok) {
            // Успешно добавлено
            console.log('Сотрудник успешно добавлен');
            // Очищаем форму
            document.getElementById('fullName').value = '';
            document.getElementById('position').value = '';
            document.getElementById('department').value = '';
            document.getElementById('contacts').value = '';

            // Скрываем форму
            addEmployeeForm.style.display = 'none';

            // Обновляем список сотрудников
            getEmployees();
        } else {
            // Ошибка при добавлении
            console.error('Ошибка при добавлении сотрудника:', response.status, response.statusText);
            // TODO: Отображение сообщения об ошибке пользователю
        }
    } catch (error) {
        console.error('Ошибка при отправке запроса:', error);
        // TODO: Отображение сообщения об ошибке пользователю
    }
});

// Обработчик события для поля поиска
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchEmployees(query);
    } else {
        getEmployees();
    }
});

// Загружаем список сотрудников при загрузке страницы
getEmployees();