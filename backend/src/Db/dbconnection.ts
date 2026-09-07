import mongoose from "mongoose";


class mongodbSerive {
    async connect() {
 try {
        
        await mongoose.connect(process.env.MONG_URL!)
        console.log("db connection is successfully")
    } catch (error) {
        console.log("error at db connection: ",error)
        process.exit(1)
    }
    }
}
export default  mongodbSerive