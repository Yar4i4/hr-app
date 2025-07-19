const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const employeesFilePath = path.join(__dirname, '../../../employees.json');

  try {
    const newEmployee = JSON.parse(event.body);
    const data = await fs.promises.readFile(employeesFilePath, 'utf8');
    const employees = JSON.parse(data);
    newEmployee.id = Date.now();
    employees.push(newEmployee);
    await fs.promises.writeFile(employeesFilePath, JSON.stringify(employees, null, 2));
    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(newEmployee)
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
      body: JSON.stringify({ message: 'Ошибка добавления сотрудника' })
    };
  }
};