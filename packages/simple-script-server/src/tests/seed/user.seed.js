export const singleUser = {
  firstName: 'user1FirstName',
  lastName: 'user1LastName',
  email: 'user1@email.com',
  password: 'user1pass',
};

export const admin = {
  ...singleUser,
  email: 'admin@admin.com',
  password: '$2a$10$Eyj9uPRdMOrqii/hm7UnOeFTcJQGasVH1ikg84BS05Qur0hCstQg6', // encoded pass
  isAdmin: true,
};

export const operations = {
  doThis: 'DoThisThing(string)',
  doThat: 'DoThatThing(integer)',
  doTheOther: 'DoTheOtherThing(float)',
};
