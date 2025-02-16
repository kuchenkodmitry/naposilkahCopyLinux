import QuestionIco from '../../assets/image/menuIcons/Question.png'
import HomeIco from '../../assets/image/menuIcons/home.png'
import RulesIco from '../../assets/image/menuIcons/rules.png'
import HistoryIco from '../../assets/image/menuIcons/history.png'
import ContractIco from '../../assets/image/menuIcons/contract.png'
import styles from '../Appbar/style.module.css'
import { useNavigate } from 'react-router'


function Appbar(params) {
    const navigate = useNavigate()
    return (
        <div className={styles.appBar}>
            <div onClick={() => { navigate('/') }} className={styles.containerButton}>
                <img src={HomeIco} className={styles.appBarButton} />
                <a>Главная</a>
            </div>
            <div onClick={() => { navigate('/') }} className={styles.containerButton}>
                <img src={HistoryIco} onClick={() => { navigate('/home') }} className={styles.appBarButton} />
                <a>История</a>
            </div>
            <div onClick={() => { navigate('/') }} className={styles.containerButton}>
                <img src={RulesIco} onClick={() => { navigate('/home') }} className={styles.appBarButton} />
                <a>Правила</a>
            </div>
            <div onClick={() => { navigate('/') }} className={styles.containerButton}>
                <img src={ContractIco} onClick={() => { navigate('/home') }} className={styles.appBarButton} />
                <a>Договор</a>
            </div>
            <div onClick={() => { navigate('/') }} className={styles.containerButton}>
                <img src={QuestionIco} onClick={() => { navigate('/home') }} className={styles.appBarButton} />
                <a>Вопросы</a>
            </div>
        </div>
    )
}

export default Appbar;
