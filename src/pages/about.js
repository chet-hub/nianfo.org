import Layout from '../components/Layout';
import styles from '../styles/About.module.css';
import Image from 'next/image';

export default function About() {
  return (
    <Layout title="关于我们 | 念否">
      <div className={styles.aboutContainer}>
        <section className={styles.aboutHeader}>
          <h1 className={styles.aboutTitle}>念否工坊的故事</h1>
          <p className={styles.aboutSubtitle}>融合日法甜点艺术，只为创造最美味的梦想</p>
        </section>

        <section className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <h2>我们的理念</h2>
            <p>
              念否梦工坊成立于2020年，由两位来自法国和日本的甜点大师联合创立。
              我们致力于将法式精致与日式美学完美融合，为每一位顾客带来独特的味蕾体验。
            </p>
            <h2>匠心制作</h2>
            <p>
              我们坚持使用最新鲜的食材，每一个甜点都是纯手工制作，
              注重细节和工艺，将甜点提升到艺术的高度。
            </p>
          </div>
          <div className={styles.aboutImage}>
            <Image 
              src="/images/1.jpg" 
              alt="念否工坊工作室" 
              width={600} 
              height={400} 
              objectFit="cover"
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}