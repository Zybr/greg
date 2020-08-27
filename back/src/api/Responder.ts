import httpStatus = require("http-status-codes");

export class Responder {
    /** Send "Internal Server Error" response. */
    public sendServerError(res, message?: string, data: string[] = []): void {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
            .send({
                data,
                message: message || httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR),
            });
    }

    /** Send "OK" response. */
    public sendOk(res, message?: string, data: string[] = []): void {
        res.status(httpStatus.OK)
            .send({
                data,
                message: message || httpStatus.getStatusText(httpStatus.OK),
            });
    }

    /** Send "Not Found" response. */
    public sendNotFound(res, message?: string, data: string[] = []): void {
        res.status(httpStatus.NOT_FOUND)
            .send({
                data,
                message: message || httpStatus.getStatusText(httpStatus.NOT_FOUND),
            });
    }

    /** Send "Not Found" response. */
    public sendBadRequest(res, message?: string, data: string[] = []): void {
        res.status(httpStatus.BAD_REQUEST)
            .send({
                data,
                message: message || httpStatus.getStatusText(httpStatus.BAD_REQUEST),
            });
    }
}
