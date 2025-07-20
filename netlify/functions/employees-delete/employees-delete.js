// C:\0191\hr-app\hr-app\netlify\functions\employees-delete\employees-delete.js
const { connectToDatabase, Employee } = require('../../utils/db');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  
  const id = event.path.split('/').pop();

  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ message: 'ID сотрудника не указан' }) };
  }

  try {
    await connectToDatabase();
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Сотрудник не найден' }) };
    }

    return {
      statusCode: 204, // Успешное удаление
      headers: { "Access-Control-Allow-Origin": "*" }
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ошибка при удалении сотрудника из базы данных' })
    };
  }
};