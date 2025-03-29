import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './style.module.css';
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from 'react-router-dom';
import { fetchOrders as fetchOrdersApi, searchOrders as searchOrdersApi } from '../../api/api'; // Импортируем API-функции
import dayjs from 'dayjs';
import DeliveryPack from '../../data/boxes.json'

const boxes = DeliveryPack

const HistoryForm = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const telegramId = Cookies.get('telegram_id');
    const authToken = Cookies.get('auth_token');
    const navigate = useNavigate();

    // Загрузка заказов через API
    const fetchOrders = async (page) => {
        if (!telegramId || !authToken) {
            setError('Необходимо авторизоваться.');
            setLoading(false);
            return;
        }

        try {
            const data = await fetchOrdersApi(telegramId, authToken, page);
            if (data.results && data.results.length === 0) {
                setHasMore(false);
            } else {
                const sortedOrders = data.results.sort((a, b) => b.id - a.id);
                setOrders(prevOrders => [...prevOrders, ...sortedOrders]);
            }
            setLoading(false);
        } catch (err) {
            setError('Ошибка при загрузке заказов.');
            setLoading(false);
        }
    };

    // Поиск заказов через API
    const searchOrders = async (query) => {
        if (!telegramId || !authToken) return;

        setLoading(true);
        setIsSearching(true);

        try {
            const data = await searchOrdersApi(telegramId, authToken, query);
            setOrders(data || []);
        } catch (err) {
            setError('Ошибка при поиске заказов.');
        } finally {
            setLoading(false);
        }
    };

    // Эффект для загрузки заказов при монтировании компонента
    useEffect(() => {
        if (!telegramId || !authToken) {
            setError('Необходимо авторизоваться.');
            setLoading(false);
            return;
        }
        fetchOrders(page);
    }, [telegramId, authToken, page]);

    // Обработчик изменения поискового запроса
    const handleSearch = (event) => {
        const value = event.target.value.trim();
        setSearchQuery(value);

        if (value === '') {
            setIsSearching(false);
            setOrders([]);
            setPage(1);
            fetchOrders(1);
        } else {
            searchOrders(value);
        }
    };

    return (
        <div className={styles.container}>
            {/* Остальной код компонента останется без изменений */}
            <div className={styles.header}>
                <div className={styles.searchBar}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Введите номер отправления"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <span className={styles.searchIcon}>🔍</span>
                </div>
            </div>
            {isSearching && (
                <button
                    className={styles.resetButton}
                    onClick={() => {
                        setSearchQuery('');
                        setIsSearching(false);
                        setOrders([]);
                        setPage(1);
                        fetchOrders(1);
                    }}
                >
                    Вернуться к истории заказов
                </button>
            )}
            {isSearching ? <h3 className={styles.part}>Результат поиска</h3> : <h3 className={styles.part}>История отправлений</h3>}
            <ul className={styles.orderList}>
                {orders.length > 0 ? (
                    orders.map(order => (
                        <li key={order.id} className={styles.orderItem}>
                            <strong>Заказ №{order.order_id || ' заказ отменён'}</strong>
                            <div className={styles.orderDetails}>
                                Дата заказа: {order.created_at != null ? dayjs(order.created_at).format('DD.MM.YYYY HH:mm:ss') : 'Неизвестной'} <br />
                                Размер посылки: {order.company != null ? boxes[order.company]?.map((e) => {
                                    if (order.dimensions == e.value) {
                                        return e.label
                                    }
                                }) : 'Информация отсутствует'} <br />
                                Вес посылки: {order.weight != null ? (order.weight + " грамм") : 'Неизвестно'} <br />
                                Тип выдачи: {order.issue ? order.issue : 'Неизвестно'} <br />
                                Ценность посылки: {order.declared_price != null ? (order.declared_price + " руб.") : 'Неизвестно'} <br />
                                Статус: {order.status || 'заказ отменён'} <br />
                                Стоимость заказа: {order.price || '0'} руб. <br />
                                Трек-номер: {order.track_number || 'Нет данных'} <br />
                            </div>
                            {order.qr_code && (
                                <>
                                    <button className={styles.toggleButton}
                                        onClick={() => navigate(`/order/${order.id}`)}
                                    >
                                        Полная информация
                                    </button>
                                    {expandedOrder === order.id && (
                                        <div className={styles.qrCodeContainer}>
                                            <QRCodeCanvas value={order.label_url} size={200} />
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    ))
                ) : (
                    <li className={styles.noResults}>Нет результатов</li>
                )}
                {loading && <li className={styles.loader}>Загрузка...</li>}
            </ul>
        </div>
    );
};

export default HistoryForm;