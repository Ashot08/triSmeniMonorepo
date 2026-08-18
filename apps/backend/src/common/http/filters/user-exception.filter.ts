import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { UserNotFoundError } from '@/modules/user/errors/user-not-found.error';
import { Response } from 'express';

@Catch(UserNotFoundError)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof UserNotFoundError) {
      response.status(404).json({
        statusCode: 404,
        message: exception.message,
      });
      return;
    }

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
