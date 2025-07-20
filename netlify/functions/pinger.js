// netlify/functions/pinger.js

// Используем нативный драйвер MongoDB для легковесного подключения
const { MongoClient } = require('mongodb');

// Ваша строка подключения будет взята из переменных окружения Netlify, 
// которые вы настраивали на сайте Netlify. Это безопасно.
const MONGODB_URI = process.env.MONGODB_URI;

exports.handler = async (event, context) => {
  // Проверка на случай, если переменная MONGODB_URI не установлена в Netlify
  if (!MONGODB_URI) {
    const errorMessage = "Критическая ошибка: переменная окружения MONGODB_URI не установлена.";
    console.error(errorMessage);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: errorMessage }),
    };
  }
  
  const client = new MongoClient(MONGODB_URI);

  try {
    // Устанавливаем соединение с кластером
    await client.connect();
    
    // Выполняем команду ping к базе 'admin'. 
    // Это стандартная, легковесная операция для проверки доступности.
    await client.db("admin").command({ ping: 1 });

    console.log("Успешный ping к MongoDB. База данных активна.");
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "База данных успешно 'разбужена'!" }),
    };
  } catch (error) {
    console.error("Ошибка при выполнении ping к MongoDB:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Не удалось выполнить ping к базе данных." }),
    };
  } finally {
    // Крайне важно всегда закрывать соединение после выполнения операции
    await client.close();
  }
};```

**Анализ и модификация `netlify.toml`:**
Ваш текущий файл `netlify.toml` настроен правильно для статического сайта с бессерверными функциями. В нем есть секции `[build]` и `[[redirects]]`. Нам нужно добавить конфигурацию для нашей scheduled-функции. Это делается добавлением новой секции `[functions.pinger]`. Она не конфликтует с существующими.

**Итоговый файл `netlify.toml` должен выглядеть так:**

```toml
# C:\0191\hr-app\hr-app\netlify.toml

[build]
  # У нас нет шага сборки (как, например, в React), поэтому команда пустая
  command = "# No build command"
  
  # Это самая важная строка. Указывает, что наш сайт - это папка "public"
  publish = "public"
  
  # Явно указываем, где лежат наши бессерверные функции
  functions = "netlify/functions"

# --- НАЧАЛО НОВОЙ СЕКЦИИ ---
# Конфигурация для функции-"будильника"
[functions.pinger]
  # Расписание в формате CRON. Эта запись означает:
  # "В 0 минут каждого 8-го часа, каждый день, каждый месяц, в любой день недели"
  # То есть, каждый день в 8:00 по времени UTC.
  # Этого более чем достаточно, чтобы база не засыпала.
  schedule = "0 8 * * *"
# --- КОНЕЦ НОВОЙ СЕКЦИИ ---


# Это правило перенаправления теперь будет работать правильно.
# Оно также помогает в работе Single Page Applications (SPA),
# перенаправляя все запросы, которые не являются файлами, на index.html
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200