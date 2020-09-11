import { Colorizer } from "../../core/Colorizer";
import db from "../db";
import { default as configs } from "./data/data-configs";

Colorizer.color();

if ("renew" === process.argv.pop()) { // Clear DB
    db.connection.dropDatabase();
}

Promise.all(configs.map(async (config) => { // Read configs
    return (await import(config.filePath).then(async (moduleExports) => { // Load data
        const {default: items} = moduleExports;

        const stories = items.map(async (properties) => { // Create story
            for (const key of Object.keys(properties)) {
                properties[key] = properties[key] instanceof Promise ? await properties[key] : properties[key];
            }

            const story = {
                err: null,
                model: null,
                properties,
            };
            // @ts-ignore . TODO: Resolve
            story.model = (new config.model(properties)) // Save by data
                // @ts-ignore
                .save()
                .catch((err) => story.err = err);

            return story;
        });

        return {
            config,
            stories: await Promise.all(stories),
        };
    }));
}))
    .then((result) => { // Build report by result
        result.forEach(async (batchResult) => {
            console.info( // Header
                batchResult.config.filePath,
                batchResult.stories.length,
                "/",
                await batchResult.config.model.countDocuments(),
            );

            batchResult.stories.forEach((story: { properties, err }) => { // Rows
                let shownProperties = {};

                if (batchResult.config.reportedProps) {
                    for (const reportedFields of batchResult.config.reportedProps) {
                        shownProperties[reportedFields] = story.properties[reportedFields];
                    }
                } else {
                    shownProperties = story.properties;
                }

                console.log(shownProperties);

                if (story.err) {
                    console.error(story.err.message);
                }
            });

            console.log(); // Footer
        });
    });
