//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules

import mongoose, { Schema, Document } from 'mongoose';

//* --------------------- MODELS ---------------------- *\\

/**
 * Defines an enum with differend gender options.
 *
 * @export
 * @enum {string}
 */
export enum Gender {
  male = 'male',
  female = 'female',
  diverse = 'diverse',
  undisclosed = 'undisclosed',
}

/**
 * Defines the user object which can be fetched from database.
 *
 * @export
 * @interface IUser
 * @extends {Document}
 */
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  gender?: Gender;
  avatar?: string;
}

//* Create the mongo database user schema
const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    verified: { type: Boolean, required: true, default: false },
    gender: { type: String, enum: Object.values(Gender) },
    avatar: { type: String, trim: true },
  },
  { timestamps: true }
);

//* --------------------- EXPORTS --------------------- *\\

//* Export the model and return the IUser interface
export default mongoose.model<IUser>('User', UserSchema);
