import './App.css';
import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useTelegramAuth from "./components/auth/telegramAuth";
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import AppBar from './components/Appbar/index';
import logo from "./assets/image/logo.png";
import styles from './pages/main/style.module.css';
import History from './pages/orderStory/index'
import Rules from './pages/rules/index'
import OrderDetails from './pages/orderDetails';
import BoxberryTrack from './pages/traking';
import { ClipLoader } from 'react-spinners';
import FAQ from './pages/faq/index'
import About from "./pages/about/index"
import Round from './assets/image/svg/round.svg'
import { sendAuthData, fetchFAQData as fetchFAQDataApi } from './api/api'; // Импортируем функцию из api.js


// Лениво загружаем страницы
const Main = lazy(() => import('./pages/main/index'));
const Choice = lazy(() => import('./pages/choice'));
const CalculateCost = lazy(() => import('./pages/calculateCost'));
const OrderInfo = lazy(() => import('./components/orderInfo/index'));
const OrderCompleted = lazy(() => import('./pages/OrderCompleted'));

function App() {
  const { authData: telegramAuthData } = useTelegramAuth();
  const [authStatus, setAuthStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [isTimeout, setIsTimeout] = useState(false); // Новый стейт для проверки таймаута
  const [errorMessage, setErrorMessage] = useState("");
  const [dataAuthErr, setDataAuthErr] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;

    // Функция для проверки инициализации Telegram Web App
    const checkTelegramWebApp = () => {
      if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;

        // Ждём готовности WebApp
        tg.ready();

        const initData = tg.initData;
        if (!initData) {
          console.log('Мини-приложение запущено вне Telegram или initData отсутствует');
          setAuthStatus('error');
          setErrorMessage('Ошибка в моменте инициализации initData');
        } else {
          console.log('Мини-приложение запущено внутри Telegram');
          console.log('Данные initData:', initData);
          setErrorMessage('Приложение запущено внутри Telegram');
          // setAuthData(initData); // Сохраняем initData для дальнейшего использования
        }
      } else {
        console.log('Объект Telegram.WebApp не найден. Мини-приложение запущено вне Telegram');
        setAuthStatus('error');
        setErrorMessage('Telegram WebApp не найден');
      }
    };

    // Устанавливаем таймер на 10 секунд
    timeoutId = setTimeout(() => {
      if (authStatus === 'loading') {
        setIsTimeout(true);
        setAuthStatus('error');
        setErrorMessage((prev) => prev + ' Таймер истёк');
      }
    }, 10000);

    // Функция для отправки данных на сервер
    const sendDataToServer = async (retries = 3) => {
      setErrorMessage('Ждёт authData');

      if (!telegramAuthData) {
        console.log('authData отсутствует, ожидание...');
        return;
      }

      setErrorMessage('Проверяет токен');
      if (Cookies.get('auth_token')) {
        setAuthStatus('success');
        clearTimeout(timeoutId); // Очищаем таймер, если авторизация успешна
        return;
      }

      try {
        setErrorMessage('Попытка запроса');
        const data = await sendAuthData({ initData: telegramAuthData }).catch((err) => {
          console.error('Ошибка из запроса:', err);
          setErrorMessage(err.message || 'Ошибка из запроса');
          throw err;
        });

        // Проверяем, что response существует и содержит auth_token
        if (data && data.auth_token) {
          setAuthStatus('success');
          Cookies.set('auth_token', data.auth_token, { expires: 7, secure: true });
          console.log('Токен сохранён:', data.auth_token);
          console.log('Telegram Auth Data:', window.Telegram.WebApp.initDataUnsafe);
          Cookies.set('telegram_id', window.Telegram.WebApp.initDataUnsafe.user.id);
          clearTimeout(timeoutId); // Очищаем таймер при успешной авторизации
        } else {
          console.error('Ответ сервера не содержит auth_token:', data);
          setAuthStatus('error');
          setErrorMessage(errorMessage + ' Неудачная авторизация: auth_token отсутствует');
        }
      } catch (error) {
        console.error('Ошибка при отправке данных:', error);

        if (retries > 0) {
          console.log(`Повторная попытка (${retries})...`);
          sendDataToServer(retries - 1); // Рекурсивный вызов с уменьшением количества попыток
        } else {
          setAuthStatus('error');
          setErrorMessage(errorMessage + ' Error добавляется в catch: ' + error.message);
        }
      }
    };

    // Функция для получения данных FAQ
    const fetchFAQData = async () => {
      try {
        const token = Cookies.get('auth_token');

        if (!token) {
          sendDataToServer();
          return;
        }

        const data = await fetchFAQDataApi(token);
        console.log('====================================');
        console.log(data);
        setAuthStatus('success');
        clearTimeout(timeoutId); // Очищаем таймер при успешной авторизации
        console.log('====================================');
      } catch (error) {
        console.error('Ошибка при получении данных FAQ:', error);
        if (error.message === 'Network Error') {
          setErrorMessage('Сетевая ошибка: проверьте подключение к интернету');
        } else {
          setErrorMessage('Ошибка при получении данных FAQ: ' + error.message);
        }
        Cookies.remove('auth_token');
        Cookies.remove('telegram_id');
        console.log('Куки удалены. Запрос новых токенов');
        sendDataToServer();
      }
    };

    // Проверяем Telegram WebApp
    checkTelegramWebApp();

    // Выполняем запрос данных FAQ
    fetchFAQData();

    return () => {
      clearTimeout(timeoutId); // Очищаем таймер при размонтировании компонента
    };
  }, [telegramAuthData]);

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  };

  return (
    <div className={styles.container}>
      <img className={styles.decorBackground1} src={Round} />
      <img className={styles.decorBackground2} src={Round} />
      {/* {location.pathname} */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        zIndex: 1000
      }}>
        <p style={{ color: 'green', width: 300 }}>{dataAuthErr}</p>
        <p style={{ color: "red" }}>{errorMessage}</p>
        <p style={{ color: "red" }}>{isTimeout}</p>
        <p style={{ color: "red" }}>{authStatus}</p>
      </div>
      <img onClick={() => { navigate('/') }} className={styles.logoImg} src={logo} alt="Логотип" />
      <div className={styles.menuContainer}>
        <Suspense fallback={
          <div className={styles.loadingContainer}>
            <ClipLoader
              color="#36d7b7" // Цвет индикатора
              size={50}       // Размер (в пикселях)
              loading={true}  // Состояние загрузки
            />
          </div>
        }>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    {authStatus === 'loading' ? (
                      <p className={styles.loadingText + ' ' + styles.loadingAnimation}>⏳ Авторизация...</p>
                    ) : authStatus === 'error' || isTimeout ? (
                      <div className={styles.errorContainer}>
                        <p className={styles.errorText}>🚫 Войти можно только через Telegram</p>
                        <a
                          href="https://t.me/naposilkah_bot"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.telegramButton}
                        >
                          телеграм-бот <b>📦НА ПОСЫЛКАХ📦</b>
                        </a>

                      </div>
                    ) : (
                      <Main />
                    )}
                  </motion.div>
                }
              />
              <Route
                path="/choice"
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <Choice />
                  </motion.div>
                }
              />
              <Route
                path="/boxberry"
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <CalculateCost />
                  </motion.div>
                }
              />
              <Route
                path="/cdek"
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <CalculateCost />
                  </motion.div>
                }
              />
              <Route
                path='/orderinfo'
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <OrderInfo />
                  </motion.div>
                }
              />
              <Route
                path='/faq'
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <FAQ />
                  </motion.div>
                }
              />
              <Route
                path='/about'
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <About />
                  </motion.div>
                }
              />
              <Route
                path='/trackBoxberry'
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <BoxberryTrack />
                  </motion.div>
                }
              />
              <Route
                path="/confirm_order/:param"
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <OrderCompleted />
                  </motion.div>
                }
              />
              <Route
                path="/history"
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <History />
                  </motion.div>
                }
              />
              <Route
                path="/rules"
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <Rules />
                  </motion.div>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <OrderDetails />
                  </motion.div>
                }
              />
              <Route
                path="*"
                element={
                  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants}>
                    <h1>404</h1>
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </Suspense>
        {location.pathname !== '/' && <AppBar />}
      </div>
    </div>
  );
}

export default App;