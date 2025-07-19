const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const employeesFilePath = process.cwd() + '/employees.json';

  try {
    const data = await fs.promises.readFile(employeesFilePath, 'utf8');
    const employees = JSON.parse(data);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
      },
      body: JSON.stringify(employees)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
      },
      body: JSON.stringify({ message: 'Ошибка чтения файла' })
    };
  }
};