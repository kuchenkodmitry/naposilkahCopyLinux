// About.js
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './style.module.css';
import { fetchAboutData as fetchAboutDataApi } from '../../api/api'; // Импортируем функцию из api.js

const About = () => {
    const [aboutData, setAboutData] = useState([]); // Состояние для хранения данных о проекте

    useEffect(() => {
        // Функция для выполнения GET-запроса через API
        const fetchAboutData = async () => {
            try {
                // Получаем токен из cookies
                const token = Cookies.get('auth_token'); // Предполагается, что токен хранится под ключом 'token'

                if (!token) {
                    console.error('Токен не найден в cookies');
                    return;
                }

                // Вызываем функцию из api.js для получения данных
                const data = await fetchAboutDataApi(token);

                // Преобразуем данные: заменяем http:// на https:// в ссылках на изображения
                const updatedData = data.map((item) => ({
                    ...item,
                    image: item.image ? convertToHttps(item.image) : null,
                }));

                // Сохраняем обновленные данные в состояние
                setAboutData(updatedData);
            } catch (error) {
                console.error('Ошибка при получении данных о проекте:', error);
            }
        };

        fetchAboutData(); // Вызываем функцию для получения данных
    }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при монтировании

    // Функция для преобразования http:// в https://
    const convertToHttps = (url) => {
        if (url && url.startsWith('http://')) {
            return url.replace('http://', 'https://');
        }
        return url; // Если уже https:// или другой протокол, возвращаем без изменений
    };

    return (
        <div className={styles.rulesContainer}>
            <h2>О проекте</h2>
            <div className={styles.cardsContainer}>
                {aboutData.map((item) => (
                    <div
                        style={item.description !== '<p>&nbsp;</p>' ? {} : { background: 'none', boxShadow: 'none' }}
                        key={item.id}
                        className={styles.card}
                    >
                        {item.title && <h3 className={styles.cardTitle}>{item.title}</h3>}
                        {/* Отображаем изображение, если оно существует */}
                        {item.image && (
                            <img
                                style={item.title ? {} : { borderRadius: '8px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)' }}
                                src={item.image}
                                alt={`Иллюстрация к разделу "${item.title}"`}
                                className={styles.cardImage}
                            />
                        )}
                        {item.description !== '<p>&nbsp;</p>' && (
                            <div
                                className={styles.cardDescription}
                                dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default About;