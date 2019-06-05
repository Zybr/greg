import {eventNames as en} from "./../../configs/socket-events";
import {Client} from "./Client";

function init() {
    document.addEventListener("DOMContentLoaded", () => {
        const client = new Client();
        const formEl = document.forms[0];

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

        formEl.addEventListener("submit", (event: Event) => {
            event.preventDefault();
            const actionEl: HTMLInputElement = document.getElementsByName("action")[0] as HTMLInputElement;
            const queryEl: HTMLInputElement = document.getElementsByName("search")[0] as HTMLInputElement;
            client.emit(`${en.crawler.subject}${en.splitters.action}${actionEl.value}`, {
                query: {
                    search: queryEl.value,
                },
                type: en.crawler.types.google,
            });
        });
    });
}

export {init};
