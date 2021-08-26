import {CHANGE_SETTING} from '../../constants/action_types';

export const changeSetting = setting => ({
  type: CHANGE_SETTING,
  payload: setting,
});
