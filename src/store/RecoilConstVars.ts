import { atom } from 'recoil';

/**
 * h5s session
 */
const AtomH5sSession = atom<string | null>({
  key: 'H5sSession',
  default: null
});

const AtomUserInfo = atom<string | null>({
  key: 'UserInfo',
  default: null
});

export default {
  AtomH5sSession,
  AtomUserInfo
};
