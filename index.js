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

    const handleError = function (error) {
        logger.error(error);
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
    }, handleError);

    logger.debug('initialize the IMU instance...');
    const imu = new SenseHat.Imu.IMU();

    logger.debug('start the IMU reader...');
    const imuTimer = {
        reference: null,
        interval: 1000 * 60,
        intervalMin: 500,
        intervalMax: 1000 * 60 * 60 * 24 * 30,
        counter: 0,
    };
    db.ref('imuInterval').on('value', function (snapshot) {
        const newInterval = parseInt(snapshot.val());

        if (newInterval < imuTimer.intervalMin || newInterval > imuTimer.intervalMax) {
            logger.error('Received invalid timer value from firebase!', newInterval);
            return;
        }

        imuTimer.interval = newInterval;
    }, handleError);
    imuTimer.counter = imuTimer.interval + 1;
    imuTimer.reference = setInterval(() => {
        if (imuTimer.counter < imuTimer.interval) {
            imuTimer.counter++;
            return;
        }

        // Reset timer
        imuTimer.counter = 0;

        // Fetch IMU data
        imu.getValue((error, data) => {
            if (error) {
                return handleError(error);
            }

            const imuData = {};

            for (let imuKey in initialFirebaseData.imu) {
                if (!initialFirebaseData.imu.hasOwnProperty(imuKey)) {
                    continue;
                }

                imuData[imuKey] = data[imuKey];
            }

            db.ref('imu').set(imuData);
        });
    }, 1);

};

logger.debug('ready');

Main();
