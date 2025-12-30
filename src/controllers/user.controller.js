import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async(req,res)=>{
    const {fullName,email,username,password} = req.body
    if([fullName,email,username,password].some((field)=>field?.trim()==="")){
        throw new ApiError("All fields are required");
    }
    const existedUser = await user.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"username with email or username already exists")
    }
})