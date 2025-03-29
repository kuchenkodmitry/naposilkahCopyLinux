// OrderCompleted.js
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styles from './OrderCompleted.module.css'; // Импортируем стили
import Cookies from 'js-cookie'; // Импортируем библиотеку для работы с куками
import BarcodeComponent from '../../components/barCode/inde';
import BoxberryImg from '../../assets/image/choice/boxberryGray.png';
import CdekImg from '../../assets/image/choice/cdekgray.png';
import classNames from 'classnames';
import { fetchOrderConfirmation as fetchOrderConfirmationApi } from '../../api/api'; // Импортируем функцию из api.js
import DeliveryPack from '../../data/boxes.json'

const OrderCompleted = () => {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState(null);
    const boxes = DeliveryPack

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = Cookies.get('auth_token'); // Предполагается, что токен хранится в куке с именем "authToken"
                if (!token) {
                    throw new Error('Токен не найден');
                }

                // Вызываем функцию из api.js для получения данных подтверждения заказа
                const data = await fetchOrderConfirmationApi(token);
                setOrderData(data);
            } catch (error) {
                console.error('Ошибка:', error);
                setError(error.response ? error.response.data : error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Пустой массив зависимостей означает, что запрос выполняется только при первом рендере

    if (loading) return <p className={styles.loadingMessage}>Загрузка...</p>;
    if (errors)
        return (
            <div className={styles.orderContainer}>
                <p className={styles.errorMessage}>Ошибка: {errors.error}</p>
                <p>Оплата была отменена</p>
                <a href="/" className={styles.homeLink}>
                    Вернуться на главную
                </a>
            </div>
        );

    return (
        <>
            <img style={{
                margin: '-15px auto 25px', display: 'block'
            }} width={200} src={orderData.company == 'boxberry' ? BoxberryImg : CdekImg} />
            <div className={styles.orderContainer}>
                <h2 className={styles.orderTitle}>Заказ успешно оформлен!</h2>
                {orderData && (
                    <div className={styles.orderInfo}>
                        <div className={classNames(styles.dataBlock, styles.fontWeight)}>
                            <p><span style={{
                                fontWeight: 700, fontSize: "16px"
                            }}>Дата заказа:</span> {dayjs(orderData.created_at).format('DD.MM.YYYY HH:mm:ss')}</p>
                            <p><span style={{
                                fontWeight: 700, fontSize: "16px"
                            }}>Примерный срок доставки:</span> {orderData.delivery_period || 'Нет данных'} {orderData.delivery_period >= 5 ? "дней" : orderData.delivery_period >= 2 ? "дня" : "день"}</p>
                            <p><span style={{
                                fontWeight: 700, fontSize: "16px"
                            }}>Заказ №:</span> {orderData.order_id || 'Нет данных'}</p>
                            <p><span style={{
                                fontWeight: 700, fontSize: "16px"
                            }}>Трек-номер:</span> {orderData.track_number || 'Нет данных'}</p>
                        </div>
                        <div className={styles.dataBlock}>
                            <h3>Данные отправителя</h3>
                            <p><span>Ф.И.О. отправителя:</span> {orderData.sender_full_name || 'Нет данных'}</p>
                            <p><span>Номер телефона:</span> +7{orderData.sender_phone || 'Нет данных'}</p>
                            <p><span>E-mail отправителя:</span> {orderData.sender_email || 'Нет данных'}</p>
                            <p><span>Адрес отправления:</span> {orderData.targetstart_address || 'Нет данных'}</p>
                        </div>
                        <div className={styles.dataBlock}>
                            <h3>Данные получателя</h3>
                            <p><span>Ф.И.О. получателя:</span> {orderData.recipient_full_name || 'Нет данных'}</p>
                            <p><span>Номер телефона:</span> +7{orderData.recipient_phone || 'Нет данных'}</p>
                            <p><span>E-mail получателя:</span> {orderData.recipient_email || 'Нет данных'}</p>
                            <p><span>Адрес доставки:</span> {orderData.target_address || 'Нет данных'}</p>
                        </div>
                        <div className={styles.dataBlock}>
                            <h3>Информация о посылке</h3>
                            <p><span>Вес посылки:</span> {orderData.weight != null ? `${orderData.weight} грамм` : 'Неизвестно'}</p>
                            <p><span>Размер посылки:</span> {orderData.company && boxes[orderData.company]?.find(e => e.value === orderData.dimensions)?.label || 'Информация отсутствует'}</p>
                            <p><span>Тип выдачи:</span> {orderData.issue || 'Информация отсутствует'}</p>
                            <p><span>Ценность посылки:</span> {orderData.declared_price != null ? `${orderData.declared_price} руб.` : 'Неизвестно'}</p>
                            <p><span>Статус:</span> {orderData.status || 'заказ отменён'}</p>
                            <p ><span>Стоимость отправки:</span> {orderData.price || '0'} руб.</p>
                            <h3 style={{
                                textAlign: 'center', marginTop: '15px'
                            }}>Штрих-код на отправку</h3>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <BarcodeComponent value={orderData.order_id} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default OrderCompleted;