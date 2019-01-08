module.exports = function () {
    const StackTrace = require('stack-trace');

    const logMessage = function (message) {
        const time = new Date().getTime();

        const traces = StackTrace.get();

        let trace = null;
        for (let i = 0; i < traces.length; i++) {
            trace = traces[i];

            if (trace.getFileName() === __filename) {
                continue;
            }

            break;
        }

        const filename = trace ? trace.getFileName() : '?';
        const lineNumber = trace ? trace.getLineNumber() : '?';

        return `${time}: \`${filename}:${lineNumber}\`: ${message}`;
    };

    return {
        error: function (message, ...optionalParams) {
            console.error(logMessage(message), ...optionalParams);
        },
        debug: function (message, ...optionalParams) {
            console.log(logMessage(message), ...optionalParams);
        },
    };
};
