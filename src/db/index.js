import mongoose from "mongoose"
import {DB_NAME} from '../constants.js'



const mongoDB = async()=>{
    try{
      const connectionInstances =  await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
      console.log(`\n mongoDB connected succesfully!! DB HOST:${ connectionInstances.connection.host}`)
    }catch(error){
        console.log("MONGODB not connected",error);
        process.exit(1);
    }
}
export default mongoDB;