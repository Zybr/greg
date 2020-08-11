import { app } from "../../app";
import { Colorizer } from "./Colorizer";
import { IError } from "./types/IError";

Colorizer.color();

/** Error handler. */
export class ErrorProcessor {
    /**
     * Handle server socket errors.
     * @param error
     */
    public static handleServerError(error: IError) {
        if (error.syscall !== "listen") {
            throw error;
        }
        const port = app.get("port");

        const bind = typeof port === "string"
            ? "Pipe " + port
            : "Port " + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case "EACCES":
                console.error(bind + " requires elevated privileges");
                /** @var {NodeJS.Process} process */
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(bind + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
}
