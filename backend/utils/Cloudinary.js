import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv";

// Load environment variables
dotenv.config();


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,

});


const uploadOnCloudinary = async (buffer, mimetype) => {
    console.log(process.env.CLOUDINARY_CLOUD_NAME); // should print your Cloudinary cloud name
    console.log(process.env.CLOUDINARY_API_KEY);    // should print your Cloudinary API key
    console.log(process.env.CLOUDINARY_API_SECRET); // should print your Cloudinary API secret
    try {
        console.log("------------------CLOUDINARY.JS------------------")

        if (!buffer) {
            return null;
        }
        const base64 = buffer.toString('base64');
        const dataURI = `data:${mimetype};base64,${base64}`;
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(dataURI, {
            resource_type: "image",
            secure: true,
        });

        //file has been uploaded successfully
        console.log("FILE UPLOADED ON CLOUDINARY");
        console.log("SUCCESSFULLY", response.secure_url)
        return response.secure_url

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return null;
    }
}


export { uploadOnCloudinary };