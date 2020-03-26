import {
  ADD_DEVICE,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
} from '../../constants/action_types';

export const addDevice = device => ({
  type: ADD_DEVICE,
  payload: device,
});

export const removeDevice = device => ({
  type: REMOVE_DEVICE,
  payload: device,
});

export const updateDevice = device => ({
  type: UPDATE_DEVICE,
  payload: device,
});
