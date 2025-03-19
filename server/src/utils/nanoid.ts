import * as _nanoid from 'nanoid';

export const nanoid = (chars?: number) => {
  return _nanoid.customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    chars || 7, // 7-characters random string by default
  )();
};
