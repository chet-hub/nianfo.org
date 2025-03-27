import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div className={styles.logo}>念否</div>
        <div className={styles.navLinks}>
          <Link href="/">首页</Link>
          <Link href="/gallery">作品</Link>
          <Link href="/order">订购</Link>
          <Link href="/about">关于</Link>
          <Link href="/contact">联系</Link>
          <Link href="#">EN</Link>
        </div>
      </div>
    </nav>
  );
}