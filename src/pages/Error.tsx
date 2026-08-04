import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<
  { children?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
  }

  render() {
    const { hasError, error, errorInfo } = this.state;
    if (hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            backgroundColor: '#f5f5f5',
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
          }}
        >
          <div
            style={{
              maxWidth: '800px',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              padding: '32px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h1
                style={{
                  color: '#ff4d4f',
                  fontSize: '24px',
                  marginBottom: '16px'
                }}
              >
                页面出错了
              </h1>
              <p
                style={{
                  color: '#666',
                  fontSize: '16px',
                  marginBottom: '24px'
                }}
              >
                抱歉，页面加载过程中发生错误
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#fafafa',
                padding: '16px',
                borderRadius: '4px',
                marginBottom: '24px',
                border: '1px solid #f0f0f0'
              }}
            >
              <h3
                style={{
                  color: '#333',
                  fontSize: '16px',
                  marginBottom: '12px'
                }}
              >
                错误信息：
              </h3>
              <pre
                style={{
                  color: '#ff4d4f',
                  fontSize: '14px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  margin: 0,
                  padding: '12px',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  border: '1px solid #ffccc7',
                  userSelect: 'text'
                }}
              >
                {error?.toString()}
              </pre>
            </div>

            {errorInfo && (
              <div
                style={{
                  backgroundColor: '#fafafa',
                  padding: '16px',
                  borderRadius: '4px',
                  marginBottom: '24px',
                  border: '1px solid #f0f0f0'
                }}
              >
                <h3
                  style={{
                    color: '#333',
                    fontSize: '16px',
                    marginBottom: '12px'
                  }}
                >
                  错误堆栈：
                </h3>
                <pre
                  style={{
                    color: '#666',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    margin: 0,
                    padding: '12px',
                    backgroundColor: '#fff',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}
                >
                  {errorInfo.componentStack}
                </pre>
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  padding: '8px 24px',
                  fontSize: '16px',
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#40a9ff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1890ff';
                }}
              >
                刷新页面
              </button>
            </div>
          </div>
        </div>
      );
    }

    const { children } = this.props;
    return children;
  }
}
