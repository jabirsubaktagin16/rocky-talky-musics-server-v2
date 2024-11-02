import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { userRole } from './user.constant';
import { IUser, UserModel } from './user.interface';

const UserSchema = new Schema<IUser>(
  {
    role: {
      type: String,
      required: true,
      enum: userRole,
      default: ENUM_USER_ROLE.USER,
    },
    password: { type: String, required: true, select: 0 },
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },
    phoneNumber: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    address: { type: String },
    avatar: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

UserSchema.statics.isUserExist = async function (
  email: string,
): Promise<Pick<IUser, '_id' | 'password' | 'role'> | null> {
  return await User.findOne({ email }, { _id: 1, password: 1, role: 1 });
};

/* UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
}; */

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

export const User = model<IUser, UserModel>('User', UserSchema);
