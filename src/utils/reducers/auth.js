import * as ls from '../localStorage';

const lsState = ls.get('setting.auth') ? ls.get('setting.auth') : false;
const defaultState = lsState;

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_AUTH':
      state = {
        ...state,
        ...action.payload
      };

      ls.set('setting.auth', state);
      return state;
    case 'RESET_AUTH':
      state = false;

      ls.del('setting.auth');
      return state;
    default:
      return state;
  }
}
