const express = require('express');
const app = express();
require('dotenv').config();
const dbconnect = require('./Database/dbconnect');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
      origin: "https://texteditorbykuldeepkumar.netlify.app/",
      methods: ["GET", "POST"]
    },
    cookie: {
        httpOnly: true,
        secure: true,
        
      }
  });

app.use(cookieParser({ domain: 'texteditorbykuldeepkumar.netlify.app' }));
app.use(bodyParser.json());
app.use(cors({
    origin: 'https://texteditorbykuldeepkumar.netlify.app',
    credentials: true,
}));
const document = require('./Routes/DocumentRoute')
const user = require('./Routes/userRoute')
app.use("/api",document)
app.use("/api",user)

io.on('connection', (socket) => {
    console.log('server connected');

    socket.on('text-change', (delta) => {
       
        socket.broadcast.emit('changed-text', delta);
      });

    socket.on('disconnect', () => {
        console.log('server disconnected');
    });
});

const PORT = process.env.PORT || 5000;

dbconnect().then(() => {
    server.listen(PORT, () => {
        console.log(`Server Started at ${PORT}`);
    });
}).catch((error) => {
    console.log("Error while connecting to the database:", error);
});
