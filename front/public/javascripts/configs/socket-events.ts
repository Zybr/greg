/** Event and action names. */
export const eventNames = {
    crawler: {
        actions: {
            complete: "complete",
            created: "created",
            error: "error",
            next: "next",
            start: "start",
            started: "started",
            stop: "stop",
            stopped: "stopped",
        },
        subject: "crawler",
        types: {
            google: "google",
        },
    },
    socket: {
        connection: "connection",
        disconnect: "disconnect",
    },
    splitters: {
        action: ":",
        section: ".",
    },
};
