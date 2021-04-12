import {
  ADD_DEVICE_NAME,
  REMOVE_DEVICE_NAME,
  UPDATE_DEVICE_NAME,
} from '../../constants/action_types';

let INITIAL_STATE = {
  infos: [
    /*{
      id: 'Clip-050990',
      name: 'Mr. Muller'
    },*/
  ],
};

const deviceNameReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_DEVICE_NAME:
      state.infos.unshift(action.payload);
      return {...state};
    case REMOVE_DEVICE_NAME:
      const removedDeviceNameIndex = state.infos.findIndex(
        info => action.payload.id === info.id,
      );
      state.infos.splice(removedDeviceNameIndex, 1);
      return {...state};
    case UPDATE_DEVICE_NAME:
      const updatedDeviceNameIndex = state.infos.findIndex(
        info => action.payload.id === info.id,
      );
      state.infos[updatedDeviceNameIndex] = action.payload;
      return {...state};
    default:
      return state;
  }
};

export default deviceNameReducer;
