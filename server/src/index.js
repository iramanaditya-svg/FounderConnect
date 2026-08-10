import "dotenv/config";

import http from "http";

import connectDB from "./db/index.js";
import app from "./app.js";

import initializeSocket from "./socket/socket.js";

connectDB()
    .then(() => {
        const server =
            http.createServer(app);

        initializeSocket(server);

        server.listen(
            process.env.PORT,
            () => {
                console.log(
                    `Server running on port ${process.env.PORT}`
                );
            }
        );
    })
    .catch((error) => {
        console.log(
            "MongoDB connection failed",
            error
        );
    });