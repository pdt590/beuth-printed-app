import {
  ADD_DEVICE_NAME,
  REMOVE_DEVICE_NAME,
  UPDATE_DEVICE_NAME,
} from '../../constants/action_types';

export const addDeviceName = deviceName => ({
  type: ADD_DEVICE_NAME,
  payload: deviceName,
});

export const removeDeviceName = deviceName => ({
  type: REMOVE_DEVICE_NAME,
  payload: deviceName,
});

export const updateDeviceName = deviceName => ({
  type: UPDATE_DEVICE_NAME,
  payload: deviceName,
});
