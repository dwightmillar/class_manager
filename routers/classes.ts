import db from "../db/server";
import { Router } from "express";
import { RequestHandler } from "express-serve-static-core";
import { Routes } from "../shared/routes";
import { MysqlError, OkPacket } from "mysql";
import { ClassObject } from "../shared/types/DatabaseObjects";

const getHandler: RequestHandler = function (req, res, next): void {
	const sql: string = `SELECT * FROM classes WHERE user = ?`;
	const params: string[] = [req.sessionID];

	const data: ClassObject[] = [];

	db.query(sql, params)
		.on("result", (row: ClassObject, index: number) => data.push(row))
		.on("error", (err: MysqlError) => next(err))
		.on("end", () => res.send({ data }));
};

const postHandler: RequestHandler = function (req, res, next): void {
	const sql = `INSERT INTO classes(user, title) VALUES (?,?)`;
	const params = [req.sessionID, req.body.name];

	let data: OkPacket;

	db.query(sql, params)
		.on("result", (result: OkPacket) => (data = result))
		.on("error", (err: MysqlError) => next(err))
		.on("end", () => res.send({ data }));
};

const deleteHandler: RequestHandler = function (req, res, next): void {
	const sql = `DELETE classes, students, assignments
				FROM classes
				LEFT JOIN students on classes.id = students.class_id
				LEFT JOIN assignments on assignments.class_id = students.class_id
				WHERE classes.id = ?`;
	const params = [req.body.id];

	let data: OkPacket;

	db.query(sql, params)
		.on("result", (row: OkPacket) => (data = row))
		.on("error", (err: MysqlError) => next(err))
		.on("end", () => res.send({ data }));
};

const router = Router();
router
	.route(Routes.Classes)
	.get(getHandler)
	.post(postHandler)
	.delete(deleteHandler);

export default router;
