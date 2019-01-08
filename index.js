// Pre loaded code
const Logger = require('./logger.js');
const logger = Logger();

logger.debug('loading');

// Load dependencies

const SenseHat = require('node-sense-hat');
const Shapes = require('./shapes.js');

// MAIN CODE

const Main = function () {
    const matrix = SenseHat.Leds;



    matrix.setPixels(Shapes.square(Shapes.colors.blue));

    logger.debug('waiting for firebase...');

    // TODO: add firebase
};

logger.debug('ready');

Main();

process.exit();
