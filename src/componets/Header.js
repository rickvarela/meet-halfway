import Logo from '../assets/svg/site-logo.svg'
import styles from './css/Header.module.css'

export const Header = () => {
    return (
        <div className={styles.siteHeader}>
            <div className={styles.siteHeaderWrapper}>
                <img src={Logo} className={styles.siteLogo} />
                <div>BY RICK VARELA</div>
            </div>
        </div>
    )
}