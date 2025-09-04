import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {user} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser=asyncHandler(async(req,res)=>{
    // get user details from frontend
    //validation- not empty 
    //check if user already exists: username,email
    //check for images ,check for avtar
    //upload them to cloudinary
    // create user object-create entry in db
    //REMOVE PASSWORD AND REFRESH TOKEN FIELD FROM RSPONSE 
    //check fro user creation 
    //return response

   const {fullName,email,username,password} =req.body
   console.log("username:", username)
    
if(
    [fullName,email,username,password].some((field) =>field?.trim() ==="")
)  {
    throw new ApiError(400,"All fields are required");  
}
const existedUser=user.findOne({
    $or:[{ username },{ email }]
 
})

if(existedUser){
    throw new ApiError(409,"User already exists");
}
const avatarLocalPath = req.files?.avatar?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;
 
if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required");
}

const avatar=await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath);

if(!avatar){
    throw new ApiError(400,"Avatar is required");
}
const user = await user.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage?.url ||"",
    email,
    password,
    username:username.toLowerCase()
})

const createdUser=await user.findById(user._id).select(
    "-password -refreshToken"
)
if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user");
}

return res.status(201).json(
        new ApiResponse(200,createdUser,"User has been registered successfully")

)
})


export {registerUser}