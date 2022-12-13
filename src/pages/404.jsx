import React, { PureComponent } from 'react';

export default class Index extends PureComponent {
  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0
        }}
      >
        <span style={{ fontSize: '200px' }}>404</span>
      </div>
    );
  }
}
