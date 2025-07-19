const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {


  const employeesFilePath = path.join(__dirname, '../../../employees.json'); // 👈 Corrected path


  const query = event.queryStringParameters.q;

  if (!query) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: 'Не указан параметр поиска q' })
    };
  }

  try {
    const data = await fs.promises.readFile(employeesFilePath, 'utf8');
    const employees = JSON.parse(data);
    const results = employees.filter(employee =>
      employee.fullName.toLowerCase().includes(query.toLowerCase())
    );
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(results)
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