import { Request, Response } from "express";

import { INTERNAL_SERVER_ERROR } from "http-status-codes";

/**
 * Error handler.
 */
export class ErrorProcessor {
    /**
     * Handle CLI error.
     *
     * @param err
     * @param addMessage
     */
    public static handleCliError(err: Error, addMessage: string = null) {
        console.error(addMessage, err.stack);
    }

    /**
     * Handle error on API operation.
     *
     * @param err
     * @param res
     */
    public static handleApiError(err: Error, res: Response) {
        res
            .status(INTERNAL_SERVER_ERROR)
            .json({
                messages: {
                    error: err.message,
                },
            });

        ErrorProcessor.handleCliError(err);
    }

    /**
     * Handle application error.
     *
     * @param err
     * @param req
     * @param res
     * @param next
     */
    public static handleAppError(err: Error, req: Request, res: Response, next: CallableFunction) {
        console.error("Application error. " + err.stack);
        res.status(500)
            .json({
                message: err.message,
            });
        next(err);
    }
}
