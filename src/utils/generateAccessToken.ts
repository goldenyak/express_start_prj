import jwt from "jsonwebtoken";

export const generateAccessToken = (_id: string) => {
    return jwt.sign({userId: _id}, "fhdgsmmbxssnxmsnxa", {expiresIn: "1h"})
}