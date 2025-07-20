// C:\0191\hr-app\hr-app\netlify\functions\employees\employees.js
const { connectToDatabase, Employee } = require('../../utils/db');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await connectToDatabase();
    const employees = await Employee.find({});
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(employees)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ошибка получения сотрудников из базы данных' })
    };
  }
};