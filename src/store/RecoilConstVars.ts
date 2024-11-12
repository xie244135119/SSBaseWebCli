/*
 * Author  Murphy.xie
 * Date  2024-10-22 15:51:26
 * LastEditors  Murphy.xie
 * LastEditTime  2024-10-30 16:20:46
 * Description  所有定义的全局状态值
 */
import { atom } from 'recoil';

/**
 * h5s session
 */
const AtomH5sSession = atom<string>({
  key: 'H5sSession',
  default: null
});

export default {
  AtomH5sSession
};
