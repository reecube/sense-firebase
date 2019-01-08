const Logger = function () {
    return {
        debug: function (message, ...optionalParams) {
            console.log(`\`${__filename}\`: ${message}`, optionalParams);
        },
    };
};

const logger = Logger();

logger.debug('started');

const Main = function () {
    const senseHat = require('node-sense-hat');

    const shapes = require('./shapes.js');

    const matrix = senseHat.Leds;

    matrix.setPixels(shapes.square(shapes.colors.blue));

    logger.debug('waiting for firebase...');

    // TODO: add firebase
};

Main();
