const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const employeesFilePath = path.join(__dirname, '../../../employees.json');
  try {
    const data = await fs.promises.readFile(employeesFilePath, 'utf8');
    const employees = JSON.parse(data);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(employees)
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
      body: JSON.stringify({ message: 'Ошибка чтения файла' })
    };
  }
};