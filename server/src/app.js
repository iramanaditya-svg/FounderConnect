import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/error.middleware.js";

import userRouter from "./routes/user.routes.js";
import startupBuilderRouter from "./routes/startupBuilder.routes.js";
import professionalRouter from "./routes/professional.routes.js";
import investorRouter from "./routes/investor.routes.js";
import startupRouter from "./routes/startup.routes.js";
import jobRouter from "./routes/job.routes.js";
import jobApplicationRouter from "./routes/jobApplication.routes.js";
import investmentRouter from "./routes/investment.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";

const app = express();

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    "https://founder-connect-two.vercel.app",
    "http://localhost:5173",
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(
            new Error("Not allowed by CORS")
        );
    },
    credentials: true,
}));

app.use(express.json({
    limit: "1mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "1mb"
}));

app.use(express.static("public"));

app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/startup-builder", startupBuilderRouter);
app.use("/api/v1/professional", professionalRouter);
app.use("/api/v1/investor", investorRouter);
app.use("/api/v1/startups", startupRouter);
app.use("/api/v1", jobRouter);
app.use("/api/v1", jobApplicationRouter);
app.use("/api/v1", investmentRouter);
app.use(
    "/api/v1",
    conversationRoutes
);


app.use(errorHandler);
export default app;