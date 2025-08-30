import mongoose from "mongoose";   


const connectDB = async () =>{
     try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
     }
     catch(error){
        console.error("MONGODB connection FAILEd:", error);
        process.exit(1);
     }
}

export default connectDB

console.log("MONGODB_URI:", process.env.MONGODB_URI);
console.log("DB_NAME:", process.env.DB_NAME);