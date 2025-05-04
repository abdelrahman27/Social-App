import mongoose from "mongoose"

const connectDB = async ()=>{
    return await mongoose.connect(process.env.DB_ATLAS)
    .then((res)=>{console.log("connect successfuly to DB..................");})
    .catch((err)=>{console.log(`fail to connect to DB ...${err}`);})
}

mongoose.set("strictQuery",true)

export default connectDB