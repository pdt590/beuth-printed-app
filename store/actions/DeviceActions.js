export const addDevice = device => ({
  type: 'ADD_DEVICE',
  payload: device,
});

export const removeDevice = index => ({
  type: 'REMOVE_DEVICE',
  payload: index,
});
