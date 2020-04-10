/* ************ DATA STRUCTURE *************
                          ** Sample data **
const data = {
  scripts: {
    'c@wait.com': {
      'c2044023-c6ac-4930-8905-301854a32288': {
        id: 'c2044023-c6ac-4930-8905-301854a32288',
        script:
          'DoThisThing(string)\nDoThatThing(integer)\nDoTheOtherThing(float)',
        runResults: '',
      },
    },
  },
  users: {
    'wait@wait.com': {
      id: 'some-id-5a78ecc1-f0eb-42b6-add8',
      firstName: 'colline',
      lastName: 'wait',
      password: '$2a$10$Eyj9uPRdMOrqii/hm7UnOeFTcJQGasVH1ikg84BS05Qur0hCstQg6',
      isAdmin: true,
    },
    'c@wait.com': {
      id: 'c858b4d4-cb79-4ef4-b0f9-4614de40bb1d',
      firstName: 'ccol',
      lastName: 'wait',
      password: '$2a$10$knbDP2pbHRaszeVe8OdDc.eyNJVuTQcMFM2rqB016SkuKhzWakWAi',
      isAdmin: false,
    },
  },
};

*/

// Added test admin. email: wait@wait.com, password: pass

const data = {
  users: {
    'wait@wait.com': {
      id: 'some-id-5a78ecc1-f0eb-42b6-add8',
      firstName: 'colline',
      lastName: 'wait',
      password: '$2a$10$Eyj9uPRdMOrqii/hm7UnOeFTcJQGasVH1ikg84BS05Qur0hCstQg6', // pass
      isAdmin: true,
    },
  },
  scripts: {},
};

export default data;
