import React, { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import api from '@/services/api';
import ProjectConfig from '../../../config/project.config';

function Login(props) {
  const [loginForm] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  // 验证码处理
  const [captchaText, setCaptchaText] = useState<string>('');

  /**
   * 登录处理
   */
  const onLogin = async () => {
    const values = loginForm.getFieldsValue();
    api.user.login(values).then((res) => {
      if (res) {
        const redirect = decodeURIComponent(location.search.replace('?', '')).replace('redirect=', '');
        navigate(redirect || '/background');
      }
    });
  };

  // 获取验证码
  const onGetCaptcha = () => {
    api.user.getCaptcha().then((res) => {
      if (res) {
        setCaptchaText(res);
      }
    });
  };

  useEffect(() => {
    onGetCaptcha();
  }, []);

  return (
    <div className={styles.LoginWrapper}>
      <div className={styles.backgroundImg} />

      <div className={styles.loginForm}>
        <div className={styles.title}>
          <h1>{ProjectConfig.title}</h1>
        </div>
        <div className={styles.loginFormContent}>
          <Form form={loginForm}>
            <Form.Item name="username" initialValue="admin">
              <Input placeholder="用户名" />
            </Form.Item>
            <Form.Item name="password" initialValue="123456">
              <Input.Password placeholder="密码" />
            </Form.Item>
            <div className={styles.verifyCode}>
              <Form.Item style={{ flex: 1 }} name="verifycode">
                <Input placeholder="验证码" />
              </Form.Item>
              <div
                className={styles.verifyImg}
                onClick={() => {
                  onGetCaptcha();
                }}
              >
                <img src={captchaText} alt="验证码图片" />
              </div>
            </div>
            <Button type="primary" block onClick={() => onLogin()}>
              登录
            </Button>
            <p className={styles.forgetPasswordTip}>如果忘记密码，请联系管理员</p>
          </Form>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {};

export default Login;
