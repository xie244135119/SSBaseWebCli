import React from 'react';
import PropTypes from 'prop-types';

export default function ChildIndex(props) {
  const { children } = props;

  return (
    <div>
      <span>子元素</span>
      {children}
    </div>
  );
}

ChildIndex.propTypes = {
  //
  children: PropTypes.oneOfType(PropTypes.arrayOf(PropTypes.element), PropTypes.element)
};

ChildIndex.defaultProps = {
  children: []
};
