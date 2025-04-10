const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_PATH];
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  credentials: true,
};
export default corsOptions;
