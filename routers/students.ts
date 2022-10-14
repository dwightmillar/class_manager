import db from "../db/server";
import { RequestHandler, Router } from "express";
import { MysqlError, OkPacket } from "mysql";
import { StudentObject } from "../shared/types/DatabaseObjects";
import { Routes } from "../shared/routes";

const getHandler: RequestHandler = function (req, res, next): void {
	const sql: string = `SELECT * FROM students WHERE user=? AND class_id=?`;
	const params: string[] = [req.sessionID, String(req.query.classId)];

	const data: StudentObject[] = [];

	db.query(sql, params)
		.on("result", (row: StudentObject, index: number) => data.push(row))
		.on("error", (err: MysqlError) => next(err))
		.on("end", () => res.send({ data }));
};

const postHandler: RequestHandler = function (req, res, next): void {
	const sql: string = `INSERT INTO students (user, name, class_id) VALUES (?,?,?)`;
	const params: string[] = [req.sessionID, req.body.name, req.body.classId];

	let data: OkPacket;

	db.query(sql, params)
		.on("result", (result: OkPacket) => (data = result))
		.on("error", (err: MysqlError) => next(err))
		.on("end", () => res.send({ data }));
};

const deleteHandler: RequestHandler = function (req, res, next): void {
	const sql: string = `DELETE students, assignments FROM
				students LEFT JOIN assignments ON
				students.id = assignments.student_id
				WHERE students.id=?`;
	const params: string[] = [req.body.id];

	let data: OkPacket;

	db.query(sql, params)
		.on("result", (result: OkPacket) => (data = result))
		.on("error", (err: MysqlError) => next(err))
		.on("end", () => res.send({ data }));
};

const router = Router();
router
	.route(Routes.Students)
	.get(getHandler)
	.post(postHandler)
	.delete(deleteHandler);

export default router;
