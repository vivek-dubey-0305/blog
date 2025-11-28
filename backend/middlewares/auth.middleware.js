import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT = async (req, res, next) => {
    // console.log("\n-------------\nVERFYJWT.js\n-------------\n")
    try {
        console.log("try");
        if (typeof window !== 'undefined') {
            console.log('we are running on the client')
        } else {
            console.log('we are running on the server');
        }
        // const cok = req.header("Authorization")?.replace("Bearer ", "")
        // console.log(req.cookies.access_token)
        // console.log(cok)
        const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "");
        // console.log("token: \n", token)

        if (!token) {
            // throw new ApiError(401, "Unauthorized Access");
            return res.status(401).json("Unauthorized Access token")
            // return new ApiError(401, "Unauthorized Access (token) - 16)").toResponse(res);

        }

        const decodedTokenInformation = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log("decodedTokenInformation: \n", decodedTokenInformation)

        // console.log(decodedTokenInformation.id)
        const user = await User.findById(decodedTokenInformation?.id);
        // console.log("user: \n", user)

        if (!user) {
            // throw new ApiError(401, "Invalid AccessToken!!");
            // return new ApiError(401, "Invalid AccessToken!!");
            return res.status(401).json("Invalid AccessToken!!")
        }

        req.user = user.id;
        req.admin = user.admin;
        // console.log("req.user: (29)", req.user, req.admin)
        next();

    } catch (error) {
        // throw new ApiError(401, error?.message || "Invalid Access Token")
        // return new ApiError(401, error?.message || "Invalid Access Token (token) - 16)").toResponse(res);
        return res.status(401).json(error?.message || "Invalid Access Token")
    }
}