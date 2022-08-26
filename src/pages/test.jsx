import React from 'react';
import PropTypes from 'prop-types';

export default function TestIndex(props) {
  const { children } = props;
  console.log(' children ', props);
  return (
    <div
      style={{
        width: '800px',
        height: '400px',
        border: '1px solid red',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {children}
    </div>
  );
}

TestIndex.propTypes = {
  //
  children: PropTypes.oneOfType(PropTypes.arrayOf(PropTypes.element), PropTypes.element)
};

TestIndex.defaultProps = {
  children: []
};
