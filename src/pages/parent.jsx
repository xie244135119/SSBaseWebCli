import React from 'react';

export default function ParentIndex(props) {
  // eslint-disable-next-line react/prop-types
  const { children } = props;
  return (
    <div>
      <span>父类页面</span>
      {children}
    </div>
  );
}
