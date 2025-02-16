const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors'); // Подключаем пакет CORS
const path = require('path');

const app = express();

// Загружаем сертификаты для HTTPS
const privateKey = fs.readFileSync('private-key.pem', 'utf8');
const certificate = fs.readFileSync('certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Включаем CORS
app.use(cors()); // Разрешаем все кросс-доменные запросы

// Обслуживаем статические файлы из папки build
app.use(express.static(path.join(__dirname, 'build')));

// Главный маршрут для отдачи HTML файла React-приложения
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// // Пример маршрута API (если он есть)
// app.post('/auth/token/login', (req, res) => {
//     res.json({ message: 'Успешная аутентификация' });
// });

// Создаем HTTPS сервер
https.createServer(credentials, app).listen(3000, '127.0.0.1', () => {
    console.log('HTTPS сервер запущен на https://127.0.0.1:3000');
});