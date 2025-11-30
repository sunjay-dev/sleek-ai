import { createConsola } from 'consola';

export const logger = createConsola({
    reporters: [
        {
            log: (logObj) => {
                console.log(JSON.stringify(logObj));
            },
        },
    ],
});