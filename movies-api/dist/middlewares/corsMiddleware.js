import cors from 'cors';
const corsOptions = {
    origin: function (origin, callback) {
        const whitelist = process.env.NODE_ENV === 'prod' ? [process.env.PROD_ORIGIN] : ['http://localhost:3000'];
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
const corsMiddleware = cors(corsOptions);
export default corsMiddleware;
