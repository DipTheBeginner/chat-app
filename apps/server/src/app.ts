import express from "express"
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import groupRoutes from "./routes/group.routes";
import chatRoutes from "./routes/chat.routes";


const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Chat Server is running",

    });
});


app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
})


app.use("/api/auth", authRoutes)
app.use("/groups", groupRoutes);
app.use("/personal",chatRoutes);

export default app;