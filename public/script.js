// public/script.js
const employeeList = document.getElementById('employeeList');
const searchInput = document.getElementById('searchInput');
const addEmployeeForm = document.getElementById('addEmployeeForm');








// Функция для отображения списка сотрудников
function displayEmployees(employees) {
    employeeList.innerHTML = '';
    employees.forEach(employee => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${employee.fullName} (${employee.position}, ${employee.department}, ${employee.contacts.phone}, ${employee.contacts.email})
            <button class="deleteButton" data-id="${employee.id}">Удалить</button> 
        `; // 👈  Добавлена кнопка
        employeeList.appendChild(li);
    });
        const deleteButtons = document.querySelectorAll('.deleteButton'); // 👈 Получаем все кнопки
  deleteButtons.forEach(button => {
    button.addEventListener('click', async () => { // 👈 Добавили async
        const employeeId = button.dataset.id;
        try {
            await deleteEmployee(employeeId); // 👈  Вызываем функцию удаления
            getEmployees(); // 👈 Обновляем список сотрудников
        } catch (error) {
            console.error('Ошибка при удалении сотрудника:', error);
            employeeList.textContent = `Ошибка при удалении сотрудника: ${error}`; // 👈  Показываем сообщение об ошибке
        }
    });
});
}




async function deleteEmployee(id) {
    try {
        const response = await fetch(`/employees/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        if (response.status !== 204) { // 👈  Проверяем статус ответа
            return await response.json(); // 👈  Парсим JSON, только если это не 204
        }
        return; // 👈  Если 204, то просто возвращаем undefined
    } catch (error) {
        console.error('Ошибка при удалении сотрудника:', error);
        throw error;
    }
}



// Функция для получения сотрудников с сервера
async function getEmployees() {
    try {
        const response = await fetch('/employees');
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
        const response = await fetch(`/employees/search?q=${encodeURIComponent(query)}`);
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Ошибка поиска сотрудников:', error);
        employeeList.textContent = 'Ошибка поиска.';
    }
}

// Функция для добавления нового сотрудника
async function addEmployee(employeeData) {
    const response = await fetch('/employees', {
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
        employeeList.textContent = `Ошибка добавления сотрудника: ${error}`;
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