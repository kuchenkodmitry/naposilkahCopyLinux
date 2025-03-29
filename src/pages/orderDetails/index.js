import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import styles from './style.module.css';
import { useParams } from 'react-router';
import BoxberryImg from '../../assets/image/choice/boxberryGray.png';
import CdekImg from '../../assets/image/choice/cdekgray.png';
import BarcodeComponent from '../../components/barCode/inde';
import { QRCodeCanvas } from "qrcode.react";
import { fetchOrderDetails as fetchOrderDetailsApi } from '../../api/api'; // Импортируем функцию из api.js
import DeliveryPack from '../../data/boxes.json'

const boxes = DeliveryPack

const OrderDetails = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Получаем ID заказа из URL
    const telegramId = Cookies.get('telegram_id');
    const authToken = Cookies.get('auth_token');

    useEffect(() => {
        if (!telegramId || !authToken) {
            setError('Необходимо авторизоваться.');
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                // Вызываем функцию из api.js для получения данных о заказе
                const data = await fetchOrderDetailsApi(telegramId, id, authToken);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке заказа.');
                setLoading(false);
                console.error(err);
            }
        };

        fetchOrder();
    }, [telegramId, authToken, id]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p>{error}</p>;
    if (!order) return <p>Заказ не найден</p>;

    return (
        <div className={styles.orderDetails}>
            <img
                style={{
                    margin: '-15px auto 25px',
                    display: 'block'
                }}
                width={200}
                src={order.company === 'boxberry' ? BoxberryImg : CdekImg}
                alt="Логотип службы доставки"
            />
            <div className={styles.orderItem}>
                <h3 style={{ margin: '0 0 15px' }}>Детальная информация о заказе №{order.order_id}</h3>
                <div className={styles.dataBlock}>
                    <p><span>Дата заказа:</span> {dayjs(order.created_at).format('DD.MM.YYYY HH:mm:ss')}</p>
                    <p><span>Примерный срок доставки:</span> {order.weight != null ? `${order.delivery_period} дней` : 'Неизвестно'}</p>
                    <p><span>Вес посылки:</span> {order.weight != null ? `${order.weight} грамм` : 'Неизвестно'}</p>
                    <p><span>Размер посылки:</span> {order.company && boxes[order.company]?.find(e => e.value === order.dimensions)?.label || 'Информация отсутствует'}</p>
                    <p><span>Ценность посылки:</span> {order.declared_price != null ? `${order.declared_price} руб.` : 'Неизвестно'}</p>
                    <p><span>Статус:</span> {order.status || 'заказ отменён'}</p>
                    <p><span>Тип выдачи:</span> {order.issue || 'заказ отменён'}</p>
                    <p><span>Стоимость заказа:</span> {order.price || '0'} руб.</p>
                    <p><span>Трек-номер:</span> {order.track_number || 'Нет данных'}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ textAlign: 'center', margin: '20px 0 0' }}>Штрих-код на отправку</h3>
                        <BarcodeComponent value={order.order_id} />
                    </div>
                </div>
                <div className={styles.dataBlock}>
                    <h3>Данные отправителя</h3>
                    <p><span>Ф.И.О отправителя:</span> {order.sender_full_name || 'Нет данных'}</p>
                    <p><span>Номер телефона:</span> +7{order.sender_phone || 'Нет данных'}</p>
                    <p><span>Email отправителя:</span> {order.sender_email || 'Нет данных'}</p>
                    <p><span>Адрес отправления:</span> {order.targetstart_address || 'Нет данных'}</p>
                </div>
                <div className={styles.dataBlock}>
                    <h3>Данные получателя</h3>
                    <p><span>Ф.И.О получателя:</span> {order.recipient_full_name || 'Нет данных'}</p>
                    <p><span>Номер телефона:</span> +7{order.recipient_phone || 'Нет данных'}</p>
                    <p><span>Email получателя:</span> {order.recipient_email || 'Нет данных'}</p>
                    <p><span>Адрес доставки:</span> {order.target_address || 'Нет данных'}</p>
                </div>
                <div className={styles.dataBlock}>
                    <h3 style={{ textAlign: 'center', margin: '20px 0 0' }}>QR-code - этикетка посылки</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                        <QRCodeCanvas value={order.label_url} size={200} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;