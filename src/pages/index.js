import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const cakeImages = [1, 2, 3];

  return (
    <Layout>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>一念之间，甜蜜永存</h1>
          <p className={styles.heroSubtitle}>法式匠心 · 日式静美</p>
          <div className={styles.heroButtons}>
            <Link href="/gallery" className="btn">探索作品</Link>
            <Link href="/order" className="btn btn-primary">预约订购</Link>
          </div>
        </div>
      </header>

      <section className={styles.gallery}>
        <h2 className={styles.galleryTitle}>精选作品</h2>
        <div className={styles.galleryGrid}>
          {cakeImages.map((img) => (
            <div key={img} className={styles.galleryItem}>
              <Image 
                src={`/images/${img}.jpg`} 
                alt={`蛋糕作品 ${img}`} 
                width={350} 
                height={350} 
                objectFit="cover"
              />
              <h3>浪漫蛋糕设计 {img}</h3>
              <p>日法融合，纯手工制作</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}