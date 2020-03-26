const INITIAL_STATE = {
  '01': {
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
  },
  '02': {
    name: 'Ms. Martin',
    value: {
      state: 'up',
      temp: 23,
      pres: 100,
      hum: 50,
      gas: 60,
      alt: 90,
    },
    updatedTime: Date.now() - 2,
  },
};

const deviceReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_DEVICE':
    case 'REMOVE_DEVICE':
    default:
      return state;
  }
};

export default deviceReducer;
