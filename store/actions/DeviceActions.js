import {ADD_DEVICE, REMOVE_DEVICE} from '../../constants/action_types';

export const addDevice = device => ({
  type: ADD_DEVICE,
  payload: device,
});

export const removeDevice = index => ({
  type: REMOVE_DEVICE,
  payload: index,
});
