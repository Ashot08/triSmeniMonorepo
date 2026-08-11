import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { UserNotFoundError } from '@/modules/user/errors/user-not-found.error';

@Catch(
  UserNotFoundError,
)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof UserNotFoundError) {
      return response.status(404).json({
        statusCode: 404,
        message: exception.message,
      });
    }

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
    });
  }
}
