document.addEventListener("DOMContentLoaded", () => {
    console.log("Socket is loaded.");
    const formEl = document.forms[0];

    formEl
        .addEventListener("click", (event: Event) => {
            event.preventDefault();
            const inputEl: HTMLInputElement = formEl.getElementsByTagName("input")[0];

            console.log(inputEl.value);
        });
});
