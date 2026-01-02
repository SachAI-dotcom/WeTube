import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

 // Configuration
    cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.API_SECRET, 
    });
    const uploadCloudinary = async(localFilePath)=>{
        try{
           if(!localFilePath)return null;
            const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlink(localFilePath);
        return response;
        }catch(error){
              fs.unlink(localFilePath);
              return null;
        }
    }

    export default  {uploadCloudinary};