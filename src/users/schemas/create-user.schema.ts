// シンプルなオブジェクトのスキーマ定義、エンティティの形式として扱う
import * as Joi from 'joi';
import { Gender } from './user.enum';

export const createUserSchema = Joi.object().keys({
  name: Joi.string().min(3).required(),
  gender: Joi.string().valid(Gender.Male, Gender.Female).required(),
  age: Joi.number().integer().min(0).required(),
});
