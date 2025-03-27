import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4>联系我们</h4>
          <p>电话: 123-456-7890</p>
          <p>邮箱: contact@tianmeng.com</p>
        </div>
        <div className={styles.footerSection}>
          <h4>营业时间</h4>
          <p>周一至周五: 10:00 - 20:00</p>
          <p>周末: 11:00 - 22:00</p>
        </div>
        <div className={styles.footerCopyright}>
          © 2024 念否工坊. 保留所有权利.
        </div>
      </div>
    </footer>
  );
}