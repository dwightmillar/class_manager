require("dotenv").config();

import compression from "compression";
import express from "express";
import { json } from "body-parser";
import { join } from "path";
import session from "express-session";
import classRouter from "./routers/classes";
import studentRouter from "./routers/students";
import assignmentRouter from "./routers/assignments";

const app = express();

const publicDir = join(__dirname, "dist");
const staticMiddlewareFunction = express.static(publicDir);

const sessionMiddleWare = session({
	secret: "fP4nfWsjK39fbdIo9an4sFoJ3vYe8L12qPjce",
	saveUninitialized: true,
	resave: true,
	proxy: true,
	cookie: {
		maxAge: 6000000,
		secure: false,
		sameSite: true,
	},
});

app.set("trust proxy", 1);
app.use(compression());
app.use(json());
app.use(sessionMiddleWare);
app.use(staticMiddlewareFunction);

app.use("/api", assignmentRouter);
app.use("/api", studentRouter);
app.use("/api", classRouter);

app.get("*", async (req, res) => res.sendFile(join(publicDir, "index.html")));

const errorRequestHandler = (error: any, req: any, res: any, next: any) => {
	res.status(500);
};
app.use(errorRequestHandler);

app.listen(process.env.APP_PORT);
