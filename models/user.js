import { encrypt } from '../lib/secure';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'First name must be filleds' },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Last name must be filled' },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: { msg: 'This email is already in use' },
      allowNull: false,
      validate: {
        isEmail: { msg: 'Invalid email address' },
      },
    },
    passwordDigest: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('passwordDigest', encrypt(value));
        this.setDataValue('password', value);
        return value;
      },
      validate: {
        len: {
          args: [1, +Infinity],
          msg: 'Password must contain at least 1 symbol',
        },
      },
    },
  }, {
    getterMethods: {
      fullName() {
        return `${this.firstName} ${this.lastName}`;
      },
      // associate(models) {
      //   // associations can be defined here
      // },
    },
  });
  return User;
};
