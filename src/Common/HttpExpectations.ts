export class HttpException extends Error {
    public status: number;
    public message: string;
    public stack: string;

    constructor(status: number, message: string, stack: string) {
        super(message);
        this.status = status;
        this.stack = stack;
        this.message = message;
    }
}
