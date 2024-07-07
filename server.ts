import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./src/routes/auth.routes";
import taskRoute from "./src/routes/task.routes";
import { connectDb } from "./src/utils/dbConnector";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

const connectionString = process.env.DB_CONNECT ?? '';
connectDb(connectionString);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
