import { Button, Grid, TextField } from "@material-ui/core";
import { SyntheticEvent } from "react";
import React from "react";
import { eventNames as en } from "../../configs/socket-events";
import { Client } from "../../services/Client";

class Search extends React.Component {
    public static propTypes: {};

    private readonly ACTION_PREFIX = `${en.crawler.subject}${en.splitters.action}`;

    private client: Client;

    private crawlerId: string;

    private value: string = "search";

    public constructor(props) {
        super(props);

        this.handleSearch = this.handleSearch.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
    }

    public render() {
        return (
            <form onSubmit={(event) => event.preventDefault()}>
                <Grid container>
                    <Grid container item xs={3} spacing={2}>
                        <Grid container item xs={12}>
                            <TextField
                                name="search"
                                label="Search"
                                onChange={this.handleValueChange}
                                value={this.value}
                            />
                        </Grid>
                        <Grid container item xs={12}>
                            <Grid container item xs={6}>
                                <Button
                                    className="search"
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSearch}
                                >search
                                </Button>
                            </Grid>
                            <Grid container item xs={6}>
                                <Button
                                    className="stop"
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.handleStop}
                                >stop
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        );
    }

    public componentDidMount(): void {
        this.client = new Client();

        this.client.on(
            `${this.ACTION_PREFIX}${en.crawler.actions.created}`,
            (data) => this.crawlerId = data.id,
        );

        for (const action in en.crawler.actions) { // Log events
            if (!en.crawler.actions.hasOwnProperty(action)) {
                continue;
            }

            const name = `${this.ACTION_PREFIX}${action}`;
            this.client.on(
                name,
                (data) => {
                    console.log(name, data);
                },
            );
        }
    }

    private handleValueChange(event: SyntheticEvent) {
        this.value = ("" + (event.target as HTMLInputElement).value).trim();
    }

    private handleSearch() {
        if (!this.value.length) {
            return;
        }

        this.client.emit(`${this.ACTION_PREFIX}${en.crawler.actions.start}`, {
            query: {
                search: this.value,
            },
            type: en.crawler.types.google,
        });
    }

    private handleStop() {
        this.client.emit(`${this.ACTION_PREFIX}${en.crawler.actions.stop}`, {
            id: this.crawlerId,
        });
    }
}

export default Search;
