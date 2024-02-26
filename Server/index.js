import {Server} from 'socket.io'
import {createServer} from 'http'
import express  from 'express';

const app = express();

const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin : "http://localhost:3001",
        methods:["GET","POST"],
        credentials:true
    }
})

const PORT = process.env.PORT || 3000;

server.listen(PORT,()=>{
    console.log(`Listening to port no ${PORT}`)
})

io.on("connection",(socket)=>{
    console.log("User Connected");
    console.log("socket ID",socket.id);
    socket.emit("welcome",`Welcome to the server`);
    socket.broadcast.emit("welcome",`New joining to the server${socket.id}`);

    socket.on('join-room',(roomName)=>{
        socket.join(roomName);
        console.log(roomName)
    })

    socket.on("message",({message,room})=>{
        // io.emit("recieve-message",message); // It will send to all io
        if(room){
            io.to(room).emit("recieve-message",message); 
        }else{
            socket.broadcast.emit("recieve-message",message); 
        }
      
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected",socket.id);
    })
})


app.get('/',(req,res)=>{
    res.send('Hello world')
})