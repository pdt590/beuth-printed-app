import {
  ADD_DEVICE,
  REMOVE_DEVICE,
  UPDATE_DEVICE,
} from '../../constants/action_types';

const INITIAL_STATE = {
  activeDevices: [
    /*{
      name: 'Mr. Muller',
      value: {
        state: 'up',
        temp: 23,
        pres: 100,
        hum: 50,
        gas: 60,
        alt: 90,
      },
      updatedTime: Date.now() - 1,
    },*/
  ],
};

const deviceReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_DEVICE:
      //console.log('ADD_DEVICE', action.payload);
      state.activeDevices.push(action.payload);
      //console.log('ADD_DEVICE_STATE', state);
      return {...state};
    case REMOVE_DEVICE:
      //console.log('REMOVE_DEVICE', action.payload);
      const removedDeviceIndex = state.activeDevices.findIndex(
        device => action.payload.name === device.name,
      );
      state.activeDevices.splice(removedDeviceIndex, 1);
      //console.log('REMOVE_DEVICE_STATE', state);
      return {...state};
    case UPDATE_DEVICE:
      //console.log('UPDATE_DEVICE', action.payload);
      const updatedDeviceIndex = state.activeDevices.findIndex(
        device => action.payload.name === device.name,
      );
      state.activeDevices[updatedDeviceIndex] = action.payload;
      //console.log('UPDATE_DEVICE_STATE', state);
      return {...state};
    default:
      return state;
  }
};

export default deviceReducer;
