import faker = require("faker/locale/en");

export default new Array(5)
    .fill(null)
    .map(() => ({
        name: faker.lorem.word(),
        structure: faker.lorem.words(),
    }));
