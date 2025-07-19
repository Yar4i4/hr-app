const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const employeesFilePath = path.join(__dirname, '../../../employees.json');
  const id = parseInt(event.path.split('/').pop()); // 👈 Get ID from path

  if (isNaN(id)) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: 'Некорректный ID сотрудника' }),
    };
  }

  try {
    const data = await fs.promises.readFile(employeesFilePath, 'utf8');
    let employees = JSON.parse(data);
    employees = employees.filter(employee => employee.id !== id);
    await fs.promises.writeFile(employeesFilePath, JSON.stringify(employees, null, 2));
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: 'Ошибка при удалении сотрудника' }),
    };
  }
};