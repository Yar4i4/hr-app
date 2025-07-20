// C:\0191\hr-app\hr-app\netlify\functions\employees-search\employees-search.js
const { connectToDatabase, Employee } = require('../../utils/db');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const query = event.queryStringParameters.q;

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Не указан параметр поиска q' })
    };
  }

  try {
    await connectToDatabase();
    const results = await Employee.find({
      fullName: { $regex: query, $options: 'i' }
    });
    
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Ошибка поиска сотрудников в базе данных' })
    };
  }
};