// public/script.js
const employeeList = document.getElementById('employeeList');
const searchInput = document.getElementById('searchInput');
const addEmployeeForm = document.getElementById('addEmployeeForm');

// Функция для отображения списка сотрудников
function displayEmployees(employees) {
    employeeList.innerHTML = '';
    employees.forEach(employee => {
        const li = document.createElement('li');
        // Используем employee.id, который мы создали в модели Mongoose
        li.innerHTML = `
            ${employee.fullName} (${employee.position}, ${employee.department}, ${employee.contacts.phone}, ${employee.contacts.email})
            <button class="deleteButton" data-id="${employee.id}">Удалить</button> 
        `;
        employeeList.appendChild(li);
    });
        const deleteButtons = document.querySelectorAll('.deleteButton');
  deleteButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const employeeId = button.dataset.id;
        try {
            await deleteEmployee(employeeId); 
            getEmployees(); 
        } catch (error) {
            console.error('Ошибка при удалении сотрудника:', error);
            alert(`Ошибка при удалении сотрудника: ${error.message}`);
        }
    });
});
}

async function deleteEmployee(id) {
    try {
        const response = await fetch(`/.netlify/functions/employees-delete/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok && response.status !== 204) {
             const errorData = await response.json().catch(() => ({ message: 'Не удалось прочитать текст ошибки' }));
            throw new Error(`Ошибка HTTP: ${response.status} - ${errorData.message}`);
        }
    } catch (error) {
        console.error('Ошибка при удалении сотрудника:', error);
        throw error;
    }
}


// Функция для получения сотрудников с сервера
async function getEmployees() {
    try {
        employeeList.textContent = 'Загрузка...'; // Индикатор загрузки
        const response = await fetch('/.netlify/functions/employees');
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const employees = await response.json();
        if (employees.length === 0) {
            employeeList.textContent = 'Сотрудники не найдены. Добавьте первого!';
        } else {
            displayEmployees(employees);
        }
    } catch (error) {
        console.error('Ошибка получения сотрудников:', error);
        employeeList.textContent = 'Ошибка загрузки данных.';
    }
}

// ... (остальной код файла script.js остается без изменений)

// Функция для поиска сотрудников
async function searchEmployees(query) {
    try {
        const response = await fetch(`/.netlify/functions/employees-search?q=${encodeURIComponent(query)}`); 
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Ошибка поиска сотрудников:', error);
        employeeList.textContent = 'Ошибка поиска.';
    }
}

// Функция для добавления нового сотрудника
async function addEmployee(employeeData) {
    const response = await fetch('/.netlify/functions/employees-create', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employeeData)
    });
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    return await response.json();
}

// Обработчик отправки формы
addEmployeeForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const position = document.getElementById('position').value;
    const department = document.getElementById('department').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    const newEmployee = {
        fullName: fullName,
        position: position,
        department: department,
        contacts: {
            phone: phone,
            email: email
        }
    };

    try {
        await addEmployee(newEmployee);
        getEmployees();
        addEmployeeForm.reset();
    } catch (error) {
        console.error('Ошибка при добавлении сотрудника:', error);
        alert(`Ошибка добавления сотрудника: ${error.message}`);
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