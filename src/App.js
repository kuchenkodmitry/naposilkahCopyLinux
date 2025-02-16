import './App.css';
import Main from './pages/main/index';
import Choice from './pages/choice';
import { Route, Routes, useLocation } from 'react-router';
import logo from "./assets/image/logo.png";
import styles from './pages/main/style.module.css';
import CalculateCost from './pages/calculateCost';
import OrderInfo from './components/orderInfo/index';
import useTelegramAuth from "./components/auth/telegramAuth";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import OrderCompleted from './pages/OrderCompleted';
import AppBar from './components/Appbar/index'

function App() {
  const { authData } = useTelegramAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState('loading');
  const location = useLocation()

  const sendDataToServer = async () => {

    try {
      if (!authData) {
        setMessage("Не все необходимые данные доступны.");
        return;
      }

      const response = await fetch("https://naposilkah.ru/auth/token/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData: authData }),
      });
      const data = await response.json();

      if (response.ok) {
        setLoading('loaded');
        setMessage(`✅ Успешно! Токен сохранен.`);
        Cookies.set('auth_token', data.auth_token, { expires: 7, secure: true }); // Записываем токен в cookie на 7 дней
        console.log("Токен сохранен:", data.auth_token);
      } else {
        setMessage(`❌ Ошибка: ${data.detail || "Неизвестная ошибка"}`);
        setLoading('error');
      }
    } catch (error) {
      setMessage(`❌ Ошибка запроса: ${error.message}`);
      setLoading('error');
    }
  };

  useEffect(() => {
    console.log("Telegram Auth Data:", window.Telegram.WebApp.initDataUnsafe);
    sendDataToServer();
  }, [authData]);

  const AuthStatus = loading === 'loading'
    ? <p>Загрузка</p>
    : loading === 'loaded'
      ? <Main />
      : <p>Ошибка. Зайдите через приложение Телеграм</p>;

  return (
    <div className={styles.container}>
      <img className={styles.logoImg} src={logo} />
      <div className={styles.menuContainer}>
        <Routes>
          {/* <Route path="/" element={AuthStatus} /> */}
          <Route path="/" element={<Main />} />
          <Route path="/choice" element={<Choice />} />
          <Route path="/boxberry" element={<CalculateCost />} />
          <Route path="/cdek" element={<CalculateCost />} />
          <Route path='/orderinfo' element={<OrderInfo />} />
          <Route path="*" element={<h1>404</h1>} />
          <Route path="/confirm_order/:param" element={<OrderCompleted />} />
        </Routes>
       {location.pathname !== '/'?<AppBar/> : ''}
      </div>
    </div>
  );
}

export default App;
