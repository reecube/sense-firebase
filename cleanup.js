module.exports = function (theProecess) {
    // Credits: https://stackoverflow.com/a/21947851/3359418

    // Object to capture process exits and call app specific cleanup function
    function noOp() {
    }

    return function (callback) {

        // attach user callback to the process event emitter
        // if no callback, it will still exit gracefully on Ctrl-C
        callback = callback || noOp;
        theProecess.on('cleanup', callback);

        // do app specific cleaning before exiting
        theProecess.on('exit', function () {
            process.emit('cleanup');
        });

        // catch ctrl+c event and exit normally
        theProecess.on('SIGINT', function () {
            console.log('Ctrl-C...');
            process.exit(2);
        });

        // catch ctrl+c event and exit normally
        theProecess.on('SIGTERM', function () {
            console.log('Ctrl-C...');
            process.exit(2);
        });

        //catch uncaught exceptions, trace, then exit normally
        theProecess.on('uncaughtException', function (e) {
            console.error('Uncaught Exception...');
            console.error(e.stack);
            process.exit(99);
        });
    }
};
