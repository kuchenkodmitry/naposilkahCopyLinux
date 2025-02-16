import React, { useState, useEffect } from 'react';
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const OrderCompleted = () => {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://naposilkah.ru/api/place-order/confirm_order/boxberry/",
                    {
                        headers: {
                            "Authorization": "Token d677468fbdc4820c3e4d5c12c0b586e534d22844",
                        },
                    }
                );
                setOrderData(response.data);
                console.log('==================+ Не ошибка==================');
                console.log(response.data);
                console.log('====================================');
            } catch (error) {
                console.log('============ошибка=================');
                console.log(error.response ? error.response.data : error.message);
                console.log('====================================');
                setError(error.response ? error.response.data : error.message);

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Пустой массив зависимостей означает, что запрос выполняется только при первом рендере

    if (loading) return <p>Загрузка...</p>;
    if (errors) return <div>
        <p>Ошибка: {errors.error}</p>
        <p>Оплата была отменена</p>
        <a href='/'>Вернуться на главную</a>
    </div>;

    return (<div>

        {orderData && (
            <div>
                <p>Компания доставки: {orderData.company}</p>
                <p>ID отправления: {orderData.id}</p>
                <QRCodeCanvas value={orderData.label_url} size={200} />
                <p>Email получателя: {orderData.recipient_email}</p>
                <p>Имя получателя: {orderData.recipient_full_name}</p>
                <p>Телефон получателя: {orderData.recipient_phone}</p>
                <p>Email отправителя: {orderData.sender_email}</p>
                <p>Имя отправителя: {orderData.sender_full_name}</p>
                <p>Телефон отправителя: {orderData.sender_phone}</p>
                <p>Статус заказа: {orderData.status}</p>
                <p>Трек номер посылки: {orderData.track_number}</p>
            </div>
        )}
        <p>Спасибо за заказ!</p>
    </div>

    );
};

export default OrderCompleted;
