// C:\0191\hr-app\hr-app\netlify\utils\db.js

const mongoose = require('mongoose');

// В Netlify переменная MONGODB_URI будет доступна напрямую из настроек
const MONGODB_URI = process.env.MONGODB_URI;

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const db = await mongoose.connect(MONGODB_URI);
  cachedDb = db;
  return db;
}

const employeeSchema = new mongoose.Schema({
  fullName: String,
  position: String,
  department: String,
  contacts: {
    phone: String,
    email: String
  }
});

// Используем _id от MongoDB вместо id
employeeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Employee = mongoose.models.Employee || mongoose.model('Employee', employeeSchema);

module.exports = { connectToDatabase, Employee };