import express from 'express'
import userRouter from './routes/user.js'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import leadRouter from './routes/lead.js';
import projectRouter from './routes/project.js';

const app = express();
const port = process.env.PORT || 3000;

connectDB()
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/uploads', express.static('uploads'));
const allowedOrigins = [
  process.env.ALLOWEDORIGINS, // from .env
  'http://localhost:5100',    // for local dev
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allow other methods if needed
  credentials: true, // if you use cookies/auth headers
};


app.use(cors(corsOptions));

app.use('/user', userRouter)
app.use('/lead', leadRouter)
app.use('/project', projectRouter)

app.get('/', (req, res)=>{
    res.send("Backen is running!")
})

app.listen(port, ()=>{
    console.log(`Server started on http://localhost:${port}`)
})