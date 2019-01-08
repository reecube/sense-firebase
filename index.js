// Pre loaded code
const Logger = require('./logger.js');
const logger = Logger();

logger.debug('loading');

// Load dependencies

/**
 * @see https://github.com/balena-io-playground/node-sense-hat
 * @see https://github.com/balena-io-playground/sense-joystick
 * @see https://github.com/rupnikj/nodeimu
 * @see https://github.com/aonghusonia/sense-hat-led
 */
const SenseHat = {
    Joystick: require('sense-joystick'),
    Leds: require('sense-hat-led'),
    Imu: require('nodeimu'),
};
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

    logger.debug('open firebase connection...');

    const initialFirebaseData = require('./firebaseData.json');
    const firebase = Firebase();
    const db = firebase.database();

    const handleFirebaseError = function (errorObject) {
        logger.error(errorObject);
    };

    logger.debug('reset firebase data...');

    for (let ifdKey in initialFirebaseData) {
        if (!initialFirebaseData.hasOwnProperty(ifdKey)) {
            continue;
        }

        db.ref(ifdKey).set(initialFirebaseData[ifdKey]);
    }

    SenseHat.Joystick.getJoystick().then(joystick => {
        logger.debug('listen to joystick actions...');

        joystick.on('press', direction => {
            db.ref('joystick/' + direction).set('pressed');
        });
        joystick.on('release', direction => {
            db.ref('joystick/' + direction).set('released');
        });
    });

    db.ref('matrix').on('value', function (snapshot) {
        const newState = snapshot.val();

        matrix.setPixels(newState);
    }, handleFirebaseError);

    /**
     * imu (rom)
     * - accel
     * - gyro
     * - compass
     * - fusionPose
     * - temperature
     * - pressure
     * - humidity
     *
     * TODO: implement this and remove imu
     */
};

logger.debug('ready');

Main();
