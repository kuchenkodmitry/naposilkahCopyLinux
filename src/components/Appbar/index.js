import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import QuestionIco from '../../assets/image/menuIcons/Question.png';
import HomeIco from '../../assets/image/menuIcons/home.png';
import RulesIco from '../../assets/image/menuIcons/rules.png';
import HistoryIco from '../../assets/image/menuIcons/history.png';
import PaperIco from '../../assets/image/icons/paper.png';
import BackIco from '../../assets/image/menuIcons/previous.png';
import styles from '../Appbar/style.module.css';

function Appbar() {
    const navigate = useNavigate();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const handleRedirectToBoxberry = () => {
        window.location.href = 'https://boxberry.ru/tracking-page';
    };
    useEffect(() => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (!isMobile) return;

        let initialHeight = window.innerHeight; // Запоминаем изначальную высоту экрана

        const handleResize = () => {
            const viewportHeight = window.visualViewport?.height || window.innerHeight;
            const heightRatio = viewportHeight / initialHeight;

            setIsKeyboardVisible(heightRatio < 0.85); // Если высота уменьшилась более чем на 15%, скрываем AppBar
        };

        window.addEventListener('resize', handleResize);
        window.visualViewport?.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.visualViewport?.removeEventListener('resize', handleResize);
        };
    }, []);

    return !isKeyboardVisible ? (
        <div className={styles.appBar}>
            <div onClick={() => navigate(-1)} className={styles.containerButton}>
                <img src={BackIco} className={styles.appBarButton} />
                <a>Назад</a>
            </div>
            <div onClick={() => navigate('/')} className={styles.containerButton}>
                <img src={HomeIco} className={styles.appBarButton} />
                <a>Главная</a>
            </div>
            <div onClick={() => navigate('/history')} className={styles.containerButton}>
                <img src={HistoryIco} className={styles.appBarButton} />
                <a>История</a>
            </div>
            <div onClick={() => navigate('/rules')} className={styles.containerButton}>
                <img src={RulesIco} className={styles.appBarButton} />
                <a>Правила</a>
            </div>
            <div onClick={() => navigate('/trackBoxberry')} className={styles.containerButton}>
                <img src={PaperIco} className={styles.appBarButton} />
                <a>Отследить</a>
            </div>
            <div onClick={() => navigate('/faq')} className={styles.containerButton}>
                <img src={QuestionIco} className={styles.appBarButton} />
                <a>Вопросы</a>
            </div>
        </div>
    ) : null;
}

export default Appbar;
