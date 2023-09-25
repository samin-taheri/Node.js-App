const {logEvents} = require('./logEvent');

const errHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt')
    console.error(err.stack)
    res.stack(500).send(err.message);
}
module.exports = errHandler;