import {asyncHandler }from "../utils/asyncHandler.js";
import { User } from "../models/User.Model.js";
import uploadCloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import mongoose from "mongoose";

const generateAccessTokenAndRefreshToken = async(userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken
        await user.save();
        return {accessToken,refreshToken}
    }catch(error){
        throw new ApiError(500,error?.message || "Something went wrong while generating access token and refresh token");

    }
}
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }
//   console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  const avatar = await uploadCloudinary(avatarLocalPath);
  let coverImage;
  if (coverImageLocalPath) {
    coverImage = await uploadCloudinary(coverImageLocalPath);
  }
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",

    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async(req,res)=>{
    const {username,password,email} = req.body;
     const user =await User.findOne(
        {$or: [{username}, {email}]}
     );
    if(!username && !email){
 throw new ApiError(400, "username or email is required")
    }
    if(!user){
        throw new ApiError("404","User does not exist");
    }
    const isPasswordCorrect = User.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        throw new ApiError("401","Invalid User Credentials")
    }
    const {accessToken ,refreshToken} = generateAccessTokenAndRefreshToken(user._id);
    const loggedInUser  = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly:true,
        secure:true
    }
    return res
    .status('200')
    .cookie("ac")
    .message("user loggedin succesfully")
})
const logOutUser = asyncHandler(async(req,res)=>{
       await User.findByIdAndUpdate(req.user._id,{
        $unset:{
          refreshToken :1,
        },
      },
        {
          new :true
        }
       )
       const options = {
        httpOnly:true,
        secure:true
       }
       return res
         .status(200)
         .clearCookie("accessToken", options)
         .clearCookie("refreshToken", options)
         .json(new ApiResponse(200, {}, "User logged Out"));
})

export  {registerUser};
