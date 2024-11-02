
class ApiError extends Error{
    success: boolean;
    statusCode: number;
    data: null;
    errors: never[];

    constructor(
        statusCode: number,
        message: string = '❗Something went wrong ',
        errors: never[] = [],
        stack = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
