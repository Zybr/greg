let express = require('express');
let router  = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send({
        'route': 'root'
    });
});

// module.exports = router;

export {router};
