import * as Joi from 'joi';
import { Gender } from './user.enum';

export const updateUserSchema = Joi.object().keys({
  name: Joi.string().min(3),
  gender: Joi.string().valid([Gender.Male, Gender.Female]),
  age: Joi.number().integer().min(0),
});
