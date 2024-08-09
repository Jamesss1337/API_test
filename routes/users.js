const express = require('express');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Document = require('../models/Document');
const Job = require('../models/Job');
const generateKey = require('../utils/generateKey');

const router = express.Router();
const dbPath = path.join(__dirname, '../db/users.json');

const isDigitsOnly = (value) => /^\d+$/.test(value);

// Проверка на существование файла БД
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]));
}

// Регистрация пользователя
router.post('/register', (req, res) => {
    const { fullName, birthDate, phone, docSeries, docNumber, issueDate, jobTitle, jobPhone, jobAddress } = req.body;

    if (!isDigitsOnly(phone) || !isDigitsOnly(jobPhone)) {
        return res.status(400).json({ message: 'Номер телефона и номер телефона на работе должны состоять только из цифр.' });
    }

    if (!isDigitsOnly(docSeries)) {
        return res.status(400).json({ message: 'Серия документа должна состоять только из цифр.' });
    }

    if (!isDigitsOnly(docNumber)) {
        return res.status(400).json({ message: 'Номер документа должен состоять только из цифр.' });
    }

    const newDocument = new Document(docSeries, docNumber, issueDate);
    const newJob = new Job(jobTitle, jobPhone, jobAddress);
    const authKey = generateKey(); // Генерация ключа

    const newUser = new User(fullName, birthDate, phone, newDocument, newJob, authKey); 

    const users = JSON.parse(fs.readFileSync(dbPath));
    const existingUser = users.find(user => user.phone === phone);
    if (existingUser) {
        return res.status(409).json({ message: 'Пользователь уже зарегистрирован.' });
    }

    users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2)); 
    res.status(201).json({ message: 'Пользователь зарегистрирован.', authKey });
});

// Авторизация пользователя. Для авторизации необходимо ввести номер телефона и ключ юзера
router.post('/login', (req, res) => {
    const { phone, authKey } = req.body; 

    if (!isDigitsOnly(phone)) {
        return res.status(400).json({ message: 'Номер телефона должен состоять только из цифр.' });
    }

    const users = JSON.parse(fs.readFileSync(dbPath));
    const user = users.find(user => user.phone === phone);

    if (user) {
        // Проверяем, соответствует ли ключ
        if (user.authKey === authKey) {
            res.status(200).json({ authKey: user.authKey });
        } else {
            res.status(403).json({ message: 'Неверный ключ.' });
        }
    } else {
        res.status(403).json({ message: 'Пользователь не найден.' });
    }
});

module.exports = router;
