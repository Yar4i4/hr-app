// C:\0191\hr-app\hr-app\netlify\functions\employees-create\employees-create.js
const { connectToDatabase, Employee } = require('../../utils/db');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const employeeData = JSON.parse(event.body);
    await connectToDatabase();
    
    const newEmployee = new Employee(employeeData);
    await newEmployee.save();

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(newEmployee)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ошибка добавления сотрудника в базу данных' })
    };
  }
};