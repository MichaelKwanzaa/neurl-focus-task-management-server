import jwt from "jsonwebtoken";

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, process.env.JWTPRIVATEKEY, options);
}

export function verifyJwt(token: string): jwt.VerifyErrors | jwt.JwtPayload {
  try {
    return jwt.verify(token, process.env.JWTPRIVATEKEY);
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      if (error.message.includes("jwt expired")) {
        return { message: "Token expired" };
      }
      return { message: "Invalid token signature" };
    }
    console.error(error);
    return { message: "Internal server error" }; // Consider returning a more generic error for security
  }
}