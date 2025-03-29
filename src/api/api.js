import axios from 'axios';
import BASE_URL from './config';

// Функция для получения заказов
export const fetchOrders = async (telegramId, authToken, page) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/profile/${telegramId}/orders/?page=${page}`, {
            headers: { Authorization: `Token ${authToken}` },
        });
        return response.data;
    } catch (err) {
        console.error('Ошибка при загрузке заказов:', err);
        throw err; // Передаем ошибку дальше, чтобы обработать её в компоненте
    }
};


// Функция для поиска заказов
export const searchOrders = async (telegramId, authToken, query) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/profile/${telegramId}/orders/search?query=${query}`, {
            headers: { Authorization: `Token ${authToken}` },
        });
        return response.data;
    } catch (err) {
        console.error('Ошибка при поиске заказов:', err);
        throw err; // Передаем ошибку дальше
    }
};

// Функция для отправки данных авторизации
export const sendAuthData = async (authData, retries = 3) => {
    try {
        console.log('Отправка данных авторизации:', authData);

        // Логируем заголовки
        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': navigator.userAgent || 'Unknown User-Agent', // Логируем User-Agent
        };
        console.log('Заголовки запроса:', headers);

        // Выполняем запрос
        const response = await axios.post(`${BASE_URL}/auth/token/login`, authData, { headers });

        // Логируем ответ сервера
        console.log('Ответ сервера:', response.data);

        return response.data; // Возвращаем данные ответа
    } catch (err) {
        // Логируем ошибку
        console.error('Ошибка при отправке данных авторизации:', err);

        // Логируем детали ошибки
        if (err.response) {
            console.error('Статус ошибки:', err.response.status);
            console.error('Данные ошибки:', err.response.data);
        } else if (err.request) {
            console.error('Сервер не ответил:', err.request);
        } else {
            console.error('Неизвестная ошибка:', err.message);
        }

        // Повторная попытка отправки
        if (retries > 0) {
            console.log(`Повторная попытка (${retries})...`);
            return sendAuthData(authData, retries - 1); // Рекурсивный вызов с уменьшением количества попыток
        }

        // Передаем ошибку дальше
        throw err;
    }
};

// Функция для загрузки предложений
export const fetchSuggestions = async (search, apiEndpoint, token) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/ofice/${apiEndpoint}/?search=${search}`, null, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
        });
        return response.data; // Возвращаем данные ответа
    } catch (err) {
        console.error('Ошибка при загрузке предложений:', err);
        throw err; // Передаем ошибку дальше
    }
};

// Функция для загрузки данных FAQ
export const fetchFAQData = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/questions`, {
            headers: {
                Authorization: `Token ${token}`, // Добавляем токен в заголовок
            },
        });
        return response.data; // Возвращаем данные ответа
    } catch (err) {
        console.error('Ошибка при загрузке данных FAQ:', err);
        throw err; // Передаем ошибку дальше
    }
};

// Функция для загрузки данных о проекте
export const fetchAboutData = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/about`, {
            headers: {
                Authorization: `Token ${token}`, // Добавляем токен в заголовок
            },
        });
        return response.data; // Возвращаем данные ответа
    } catch (err) {
        console.error('Ошибка при загрузке данных о проекте:', err);
        throw err; // Передаем ошибку дальше
    }
};

// Функция для отправки данных заказа
export const submitOrderData = async (orderDataUrl, requestData, token) => {
    try {
        const response = await axios.post(orderDataUrl, requestData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`, // Добавляем токен в заголовок
            },
        });
        return response.data; // Возвращаем данные ответа
    } catch (err) {
        console.error('Ошибка при отправке данных заказа:', err);
        throw err; // Передаем ошибку дальше
    }
};

// Функция для отправки данных для расчета стоимости
export const calculateCost = async (telegramId, deliveryType, requestData, token) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/calculate-cost/${telegramId}/${deliveryType}/`, requestData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`,
            },
        });
        return response.data; // Возвращаем данные ответа
    } catch (err) {
        console.error('Ошибка при отправке данных для расчета стоимости:', err);
        throw err; // Передаем ошибку дальше
    }
};

// Функция для загрузки данных подтверждения заказа
export const fetchOrderConfirmation = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/place-order/confirm_order/boxberry/`, {
            headers: {
                Authorization: `Token ${token}`, // Добавляем токен в заголовок
            },
        });
        return response.data; // Возвращаем данные ответа
    } catch (err) {
        console.error('Ошибка при загрузке данных подтверждения заказа:', err);
        throw err; // Передаем ошибку дальше
    }
};

// Функция для загрузки данных о заказе
export const fetchOrderDetails = async (telegramId, orderId, token) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/profile/${telegramId}/orders/${orderId}/`, {
            headers: {
                Authorization: `Token ${token}`, // Добавляем токен в заголовок
            },
        });
        return response.data; // Возвращаем данные ответа
    } catch (err) {
        console.error('Ошибка при загрузке данных о заказе:', err);
        throw err; // Передаем ошибку дальше
    }
};

// Функция для загрузки данных правил
export const fetchRulesData = async (token) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/rules`, {
            headers: {
                Authorization: `Token ${token}`, // Добавляем токен в заголовок
            },
        });
        return response.data; // Возвращаем данные ответа
    } catch (err) {
        console.error('Ошибка при загрузке данных правил:', err);
        throw err; // Передаем ошибку дальше
    }
};