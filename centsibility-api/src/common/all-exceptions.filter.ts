import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

// Makes every error use the Standard Error Response from Lab 05
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error.';
    let errors: string[] = ['Something went wrong on the server.'];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const r: any = exception.getResponse();
      if (typeof r === 'string') {
        message = r;
        errors = [r];
      } else if (Array.isArray(r.message)) {
        // validation errors from class-validator
        message = 'Invalid request data.';
        errors = r.message;
      } else {
        message = r.message ?? message;
        errors = r.errors ?? [r.message ?? message];
      }
      if (status === HttpStatus.UNAUTHORIZED && !r.errors) {
        message = message === 'Unauthorized' ? 'Authentication required.' : message;
        errors = ['No token, invalid token, or token has expired.'];
      }
    } else {
      this.logger.error(exception);
    }

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}
