import cors from 'cors';


const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    
    const whitelist = ['*', '*'];
    
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS'));  
    }
  },
  credentials: true, 
  optionsSuccessStatus: 200 
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;