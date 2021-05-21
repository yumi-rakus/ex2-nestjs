import * as Joi from 'joi';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private readonly schema: any) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    const { error } = Joi.valid(value, this.schema);
    if (error) {
      throw new BadRequestException(error);
    }
    return value;
  }
}
