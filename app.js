const express=require('express')
const config=require('./app/config/index')
const cors=require('cors')
const routers=require('./app/routes/index')
const path=require('path')
const db=require('./app/config/db')
const app=express()
const PORT=config.PORT

app.use(cors())
app.use(express.json());

// db.connect(error => {
//     if(error) {
//       console.error('Error connecting to MySQL: ', error);
//       return;
//     }
  
//     console.log('MySQL connected!');
//   });
  
//   db.on('error', error => {
//     console.error('MySQL error: ', error);
//   });

app.use('/',routers)
app.use('/upload', express.static(path.join(__dirname, '/upload')));
app.listen(PORT,()=>{
    console.log("server is running on port"+PORT)
})