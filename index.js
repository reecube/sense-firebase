// Pre loaded code
const Logger = require('./logger.js');
const logger = Logger();

logger.debug('loading');

// Load dependencies

const SenseHat = require('node-sense-hat');
const Shapes = require('./shapes.js');
const Cleanup = require('./cleanup.js')(process);
const Firebase = require('./firebase.js');

// MAIN CODE

const Main = function () {
    const matrix = SenseHat.Leds;

    Cleanup(function () {
        matrix.clear([0, 0, 0]);

        logger.debug('exit');
    });

    matrix.setPixels(Shapes.square(Shapes.colors.blue));

    logger.debug('waiting for firebase...');

    const firebase = Firebase();

    const db = firebase.database();

    return db.ref('shape').on('value', function(snapshot) {
        const nextShape = snapshot.val();

        switch (nextShape) {
            case 'cross':
                matrix.setPixels(Shapes.cross());
                break;
            case 'square':
                matrix.setPixels(Shapes.square());
                break;
            default:
                matrix.clear([0, 0, 0]);
                break;
        }
    }, function (errorObject) {
        logger.error(errorObject);
    });
};

logger.debug('ready');

Main();
