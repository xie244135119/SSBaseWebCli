//
const getStateByTypes = (keyList = [], aAny = {}) => {
  const newState = {};
  let newStateSendor = null;
  for (let index = 0; index < keyList.length; index += 1) {
    const key = keyList[index];

    if (index === keyList.length - 1) {
      newStateSendor[key] = aAny;
    } else if (newStateSendor === null) {
      newState[key] = {};
      newStateSendor = newState[key];
    } else {
      newStateSendor[key] = {};
      newStateSendor = newStateSendor[key];
    }
  }
  return newState;
};

/**
 * 生成根Reducer
 */
const rootReducer = (state, action) => {
  // dispatch event
  const { type = '', payload } = action;
  if (typeof type !== 'string' || payload === undefined) {
    return state;
  }
  // if type exist multi level
  const typeKeys = type.split('/');
  // max level = 3;
  if (typeKeys.length > 2 || typeKeys === 0) {
    return state;
  }
  const newState = getStateByTypes(typeKeys, payload);
  return { ...state, ...newState };
};

export default rootReducer;
