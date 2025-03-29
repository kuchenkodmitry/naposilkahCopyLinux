// Rules.js
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './style.module.css';
import { fetchRulesData as fetchRulesDataApi } from '../../api/api'; // Импортируем функцию из api.js

const Rules = () => {
    const [rulesData, setRulesData] = useState([]); // Состояние для хранения данных правил
    const [activeIndex, setActiveIndex] = useState(null); // Состояние для отслеживания активной карточки

    useEffect(() => {
        // Функция для выполнения GET-запроса через API
        const fetchRules = async () => {
            try {
                // Получаем токен из cookies
                const token = Cookies.get('auth_token'); // Предполагается, что токен хранится под ключом 'auth_token'

                if (!token) {
                    console.error('Токен не найден в cookies');
                    return;
                }

                // Вызываем функцию из api.js для получения данных правил
                const data = await fetchRulesDataApi(token);

                // Преобразуем данные: заменяем http:// на https:// в ссылках на изображения
                const updatedData = data.map((item) => ({
                    ...item,
                    image: item.image ? convertToHttps(item.image) : null,
                }));

                // Сохраняем обновленные данные в состояние
                setRulesData(updatedData);
            } catch (error) {
                console.error('Ошибка при получении данных правил:', error);
            }
        };

        fetchRules(); // Вызываем функцию для получения данных
    }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при монтировании

    // Функция для преобразования http:// в https://
    const convertToHttps = (url) => {
        if (url && url.startsWith('http://')) {
            return url.replace('http://', 'https://');
        }
        return url; // Если уже https:// или другой протокол, возвращаем без изменений
    };

    // Функция для переключения активной карточки
    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index); // Закрывает текущую или открывает новую карточку
    };

    return (
        <div className={styles.rulesContainer}>
            <h2 className={styles.pageTitle}>Правила отправки посылок</h2>
            <div className={styles.cardsContainer}>
                {rulesData.map((item, index) => (
                    <div key={item.id} className={styles.card}>
                        {/* Заголовок карточки */}
                        <h3
                            className={`${styles.cardTitle} ${activeIndex === index ? styles.active : ''}`}
                            onClick={() => toggleAccordion(index)}
                        >
                            {item.title}
                        </h3>

                        {/* Контент карточки (отображается только если карточка активна) */}
                        <div
                            className={`${styles.cardContent} ${activeIndex === index ? styles.active : ''}`}
                        >
                            {/* Отображаем изображение, если оно существует */}
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={`Иллюстрация к правилу ${item.title}`}
                                    className={styles.cardImage}
                                />
                            )}
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

export default Rules;