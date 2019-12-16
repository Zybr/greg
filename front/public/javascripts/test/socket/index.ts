import {eventNames as en} from "./../../configs/socket-events";
import {Client} from "./Client";

function init() {
    document.addEventListener("DOMContentLoaded", () => {
        const client = new Client();
        const formEl = document.forms[0];
        const btnSearch = formEl.getElementsByClassName("search")[0];
        const btnStop = formEl.getElementsByClassName("stop")[0];

        for (const action in en.crawler.actions) { // Subscribe on each crawler events.
            if (!en.crawler.actions.hasOwnProperty(action)) {
                continue;
            }

            const name = `${en.crawler.subject}${en.splitters.action}${action}`;
            client.on(
                name,
                (data) => {
                    console.log(name, data);
                },
            );
        }

        // Start search
        btnSearch.addEventListener("click", (event: Event) => {
            event.preventDefault();

            const queryEl: HTMLInputElement = document.getElementsByName("search")[0] as HTMLInputElement;
            client.emit(`${en.crawler.subject}${en.splitters.action}${en.crawler.actions.start}`, {
                query: {
                    search: queryEl.value,
                },
                type: en.crawler.types.google,
            });
        });

        // Stop search
        btnStop.addEventListener("click", (event: Event) => {
            event.preventDefault();

            client.emit(`${en.crawler.subject}${en.splitters.action}${en.crawler.actions.stop}`, {});
        });
    });
}

export {init};
