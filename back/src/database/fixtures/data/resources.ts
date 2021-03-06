import faker = require("faker/locale/en");
import Map from "../../models/Map";

export default new Array(5)
    .fill(null)
    .map(() => ({
        map: new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                const count = await Map.countDocuments();

                if (count) {
                    clearInterval(interval);
                    resolve(Map.findOne().skip(Math.random() * count));
                }
            }, 1);
        }),
        name: faker.lorem.word(),
        parameters: (() => {
            const params = {};
            for (let i = 0; i < faker.random.number(5); i++) {
                params[faker.lorem.word()] = faker.lorem.word();
            }

            return params;
        })(),
        url: faker.internet.url(),
    }));
