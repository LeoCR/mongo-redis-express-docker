import { NextFunction, Response, Request } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  resp: Response,
  next: NextFunction
) => {
    if (resp.headersSent) {
      return next(err);
    }
    else if(err.message && err.stack && err.name){
        console.error("Error detected: ", JSON.stringify(err));
        return resp.status(500).json({
          errorName: err.name,
          message: err.message,
          ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        });
    }
    else if(err){
        console.error("Unknown Error detected: ", JSON.stringify(err));
        return resp.status(500).json({
            errorName: 'Unknown error.',
            message: "An unexpected error occurs",
        })
    }
};