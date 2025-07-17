// public/script.js
const API_ENDPOINT = '/.netlify/functions/employees'; //  Укажите  путь  к  функции Netlify

async function getEmployees() {
    try {
        const response = await fetch(API_ENDPOINT + '/employees');
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Ошибка получения сотрудников:', error);
        employeeList.textContent = 'Ошибка загрузки данных.';
    }
}

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

