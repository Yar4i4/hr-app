document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const employeeList = document.getElementById('employeeList');
    const searchInput = document.getElementById('searchInput');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    const saveEmployeeBtn = document.getElementById('saveEmployeeBtn');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    
    // Поля формы
    const fullNameInput = document.getElementById('fullName');
    const positionInput = document.getElementById('position');
    const departmentInput = document.getElementById('department');
    const contactsInput = document.getElementById('contacts');

    // Настройка API
    const API_ENDPOINT = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/employees' 
        : '/.netlify/functions/employees';

    console.log('Используемый API endpoint:', API_ENDPOINT);

    // Функция отображения уведомлений
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Функция отображения сотрудников
    function displayEmployees(employees) {
        console.log('Отображаем сотрудников:', employees);
        employeeList.innerHTML = '';

        if (!employees || employees.length === 0) {
            employeeList.innerHTML = '<li class="no-employees">Нет сотрудников для отображения</li>';
            return;
        }

        employees.forEach(employee => {
            const li = document.createElement('li');
            li.className = 'employee-item';
            li.innerHTML = `
                <div class="employee-details">
                    <h3>${employee.fullName || 'Не указано'}</h3>
                    <p><strong>Должность:</strong> ${employee.position || 'Не указана'}</p>
                    <p><strong>Отдел:</strong> ${employee.department || 'Не указан'}</p>
                    <p><strong>Контакты:</strong> ${employee.contacts || 'Не указаны'}</p>
                </div>
                <button class="delete-btn" data-id="${employee.id}">
                    <span class="trash-icon">🗑️</span> Удалить
                </button>
            `;
            employeeList.appendChild(li);
        });

        // Добавляем обработчики событий для кнопок удаления
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                if (confirm('Вы точно хотите удалить этого сотрудника?')) {
                    await deleteEmployee(id);
                }
            });
        });
    }

    // Функция удаления сотрудника (ИСПРАВЛЕННАЯ)
    async function deleteEmployee(id) {
        try {
            console.log('Попытка удаления сотрудника с ID:', id);
            const response = await fetch(`${API_ENDPOINT}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            // Проверяем Content-Type ответа
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Сервер вернул не JSON: ${text.substr(0, 100)}...`);
            }

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || `Ошибка сервера: ${response.status}`);
            }

            console.log('Результат удаления:', result);
            await getEmployees(); // Обновляем список
            showNotification(result.message || 'Сотрудник успешно удален', 'success');
        } catch (error) {
            console.error('Полная ошибка удаления:', {
                error: error.message,
                endpoint: `${API_ENDPOINT}/${id}`,
                stack: error.stack
            });
            showNotification(`Ошибка: ${error.message}`, 'error');
        }
    }

    // Функция для получения списка сотрудников
    async function getEmployees() {
        try {
            console.log('Запрос на получение списка сотрудников...');
            const response = await fetch(API_ENDPOINT, {
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const employees = await response.json();
            console.log('Получены сотрудники:', employees);
            displayEmployees(employees);
        } catch (error) {
            console.error('Ошибка при получении сотрудников:', error);
            employeeList.innerHTML = `
                <li class="error-message">
                    Ошибка загрузки данных: ${error.message}<br>
                    <button onclick="location.reload()">Обновить страницу</button>
                </li>
            `;
        }
    }

    // Функция для добавления нового сотрудника
    async function addNewEmployee(employeeData) {
        try {
            console.log('Отправка данных нового сотрудника:', employeeData);
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(employeeData)
            });

            console.log('Ответ сервера:', response);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Ошибка сервера: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка при добавлении сотрудника:', error);
            throw error;
        }
    }

    // Функция для поиска сотрудников
    async function searchEmployees(query) {
        try {
            console.log('Поиск сотрудников по запросу:', query);
            const response = await fetch(`${API_ENDPOINT}/search?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const employees = await response.json();
            displayEmployees(employees);
        } catch (error) {
            console.error('Ошибка при поиске сотрудников:', error);
            showNotification('Ошибка при выполнении поиска', 'error');
        }
    }

    // Обработчик для кнопки добавления сотрудника
    addEmployeeBtn.addEventListener('click', () => {
        addEmployeeForm.style.display = 'block';
        fullNameInput.focus();
    });

    // Обработчик для кнопки отмены
    cancelAddBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addEmployeeForm.style.display = 'none';
        fullNameInput.value = '';
        positionInput.value = '';
        departmentInput.value = '';
        contactsInput.value = '';
    });

    // Обработчик для кнопки сохранения
    saveEmployeeBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Валидация
        if (!fullNameInput.value.trim()) {
            showNotification('Поле "ФИО" обязательно для заполнения!', 'error');
            fullNameInput.focus();
            return;
        }

        // Подготовка данных
        const newEmployee = {
            fullName: fullNameInput.value.trim(),
            position: positionInput.value.trim() || 'Не указано',
            department: departmentInput.value.trim() || 'Не указано',
            contacts: contactsInput.value.trim() || 'Не указано'
        };

        try {
            // Добавление сотрудника
            const result = await addNewEmployee(newEmployee);
            console.log('Сотрудник добавлен:', result);
            
            // Очистка формы
            fullNameInput.value = '';
            positionInput.value = '';
            departmentInput.value = '';
            contactsInput.value = '';
            addEmployeeForm.style.display = 'none';

            // Обновление списка
            await getEmployees();
            
            // Уведомление
            showNotification('Сотрудник успешно добавлен!', 'success');
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
            showNotification(`Ошибка: ${error.message}`, 'error');
        }
    });

    // Обработчик для поля поиска
    searchInput.addEventListener('input', debounce(async () => {
        const query = searchInput.value.trim();
        if (!query) {
            await getEmployees();
            return;
        }

        await searchEmployees(query);
    }, 300));

    // Функция для дебаунса
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Инициализация при загрузке страницы
    getEmployees();
});