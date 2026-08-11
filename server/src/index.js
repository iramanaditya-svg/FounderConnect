import "dotenv/config";

import connectDB from "./db/index.js";
import app from "./app.js";

let dbConnected = false;

const ensureDBConnection = async () => {
    if (!dbConnected) {
        await connectDB();
        dbConnected = true;
    }
};

const handler = async (req, res) => {
    await ensureDBConnection();
    return app(req, res);
};

export default handler;