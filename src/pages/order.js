import { useState } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Order.module.css';

export default function Order() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cakeType: '',
    specialRequests: ''
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
    alert('订单已提交');
  };

  return (
    <Layout title="预约订购 | 念否">
      <div className={styles.orderContainer}>
        <h1 className={styles.orderTitle}>预约定制</h1>
        <form onSubmit={handleSubmit} className={styles.orderForm}>
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
            <label htmlFor="phone">电话</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone}
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
            <label htmlFor="cakeType">蛋糕类型</label>
            <select 
              id="cakeType" 
              name="cakeType"
              value={formData.cakeType}
              onChange={handleChange}
              required
            >
              <option value="">选择蛋糕类型</option>
              <option value="wedding">婚礼蛋糕</option>
              <option value="birthday">生日蛋糕</option>
              <option value="custom">定制蛋糕</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="specialRequests">特殊需求</label>
            <textarea 
              id="specialRequests" 
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <button type="submit" className="btn btn-primary">提交订单</button>
        </form>
      </div>
    </Layout>
  );
}