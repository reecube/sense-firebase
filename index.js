// Pre loaded code
const Logger = require('./logger.js');
const logger = Logger();

logger.debug('loading');

// Load dependencies

const SenseHat = require('node-sense-hat');
const Shapes = require('./shapes.js');
const Cleanup = require('./cleanup.js')(process);

// MAIN CODE

const Main = function () {
    const matrix = SenseHat.Leds;

    Cleanup(function () {
        matrix.clear([0, 0, 0]);

        logger.debug('exit');
    });

    matrix.setPixels(Shapes.square(Shapes.colors.blue));

    logger.debug('waiting for firebase...');

    // TODO: add firebase
};

logger.debug('ready');

Main();
