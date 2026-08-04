import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 404 页面：白底简约风格，黑色按钮。
 */
export default function Notfound() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        boxSizing: 'border-box',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff',
        color: '#1a1a1a',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', textAlign: 'center' }}>
        {/* 404 主体：浅灰描边 + 黑色填充，简洁有质感 */}
        <div
          style={{
            fontSize: '200px',
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '4px',
            color: '#1a1a1a',
            textShadow: '0 6px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          404
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 24,
            fontWeight: 600,
            color: '#1a1a1a',
            letterSpacing: '2px'
          }}
        >
          页面走丢了
        </div>

        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            color: 'rgba(0, 0, 0, 0.45)'
          }}
        >
          抱歉，您访问的页面不存在或已被移除
        </div>

        <div style={{ marginTop: 36, display: 'flex', gap: 16, justifyContent: 'center' }}>
          <span
            onClick={() => navigate('/')}
            style={{
              padding: '11px 32px',
              fontSize: 15,
              fontWeight: 500,
              borderRadius: 24,
              cursor: 'pointer',
              color: '#fff',
              background: '#000',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            返回首页
          </span>
          <span
            onClick={() => window.history.back()}
            style={{
              padding: '11px 32px',
              fontSize: 15,
              fontWeight: 500,
              borderRadius: 24,
              cursor: 'pointer',
              color: '#000',
              border: '1px solid #000',
              background: 'transparent',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#000';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#000';
            }}
          >
            返回上一页
          </span>
        </div>
      </div>
    </div>
  );
}
