import 'dotenv/config';
import mongoDB from './db/index.js'



const PORT = process.env.PORT || 8000

mongoDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })

})
.catch((err)=>{
    console.log("MONGO db connection failed !!! ", err);
})