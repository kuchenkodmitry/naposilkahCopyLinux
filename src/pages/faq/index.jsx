// FAQ.js
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './style.module.css';
import { fetchFAQData as fetchFAQDataApi } from '../../api/api'; // Импортируем функцию из api.js

const FAQ = () => {
    const [faqData, setFaqData] = useState([]); // Состояние для хранения данных FAQ
    const [activeIndex, setActiveIndex] = useState(null); // Состояние для отслеживания активной карточки

    // Функция для переключения активной карточки
    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index); // Закрывает текущую или открывает новую карточку
    };

    // Функция для преобразования http:// в https://
    const convertToHttps = (url) => {
        if (url && url.startsWith('http://')) {
            return url.replace('http://', 'https://');
        }
        return url; // Если уже https:// или другой протокол, возвращаем без изменений
    };

    useEffect(() => {
        // Функция для выполнения GET-запроса через API
        const fetchFAQData = async () => {
            try {
                // Получаем токен из cookies
                const token = Cookies.get('auth_token'); // Предполагается, что токен хранится под ключом 'token'

                if (!token) {
                    console.error('Токен не найден в cookies');
                    return;
                }

                // Вызываем функцию из api.js для получения данных FAQ
                const data = await fetchFAQDataApi(token);

                // Преобразуем данные, если есть file
                const updatedData = data.map((item) => ({
                    ...item,
                    file: item.file ? convertToHttps(item.file) : null,
                }));

                // Сохраняем обновленные данные в состояние
                setFaqData(updatedData);
            } catch (error) {
                console.error('Ошибка при получении данных FAQ:', error);
            }
        };

        fetchFAQData(); // Вызываем функцию для получения данных
    }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при монтировании

    return (
        <div className={styles.rulesContainer}>
            <h2 className={styles.pageTitle}>Часто задаваемые вопросы</h2>
            <div className={styles.cardsContainer}>
                {faqData.map((item, index) => (
                    <div key={item.id} className={styles.card}>
                        {/* Заголовок карточки */}
                        <h3
                            className={`${styles.cardTitle} ${activeIndex === index ? styles.active : ''}`}
                            onClick={() => toggleAccordion(index)}
                        >
                            {item.name}
                        </h3>

                        {/* Контент карточки (отображается только если карточка активна) */}
                        <div
                            className={`${styles.cardContent} ${activeIndex === index ? styles.active : ''}`}
                        >
                            {/* Отображаем изображение, если оно существует */}
                            {item.file && (
                                <img
                                    src={item.file}
                                    alt={`Иллюстрация к правилу ${item.name}`}
                                    className={styles.cardImage}
                                />
                            )}
                            {/* Используем dangerouslySetInnerHTML для отображения HTML-разметки */}
                            <div
                                className={styles.cardDescription}
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;