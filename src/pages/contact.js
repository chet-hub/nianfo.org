import { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 实际提交逻辑需要后端处理
    alert('消息已发送');
  };

  return (
    <Layout title="联系我们 | 念否">
      <div className={styles.contactContainer}>
        <div className={styles.contactInfo}>
          <h1 className={styles.contactTitle}>联系我们</h1>
          <div className={styles.contactDetails}>
            <p>📍 地址: 北京市朝阳区 XX 街道 XX 号</p>
            <p>📞 电话: 123-456-7890</p>
            <p>✉️ 邮箱: contact@tianmeng.com</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">姓名</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">邮箱</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">留言</label>
            <textarea 
              id="message" 
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">发送消息</button>
        </form>
      </div>
    </Layout>
  );
}