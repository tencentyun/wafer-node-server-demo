global.debug = (() => {
    const log = console.log.bind(console);

    return function () {
        log('========================================');
        log.apply(null, Array.from(arguments).map(item => {
            return (typeof item === 'object'
                ? JSON.stringify(item, null, 2)
                : item);
        }));
        log('========================================\n');
    };
})();