import db from "../db/server";
import { RequestHandler, Router } from "express";
import { MysqlError, OkPacket } from "mysql";
import { AssignmentObject } from "../shared/types/DatabaseObjects";

const getHandler: RequestHandler = (req, res, next) => {
	const sql = `SELECT * FROM assignments WHERE user=? AND class_id=?`;
	const params = [req.sessionID, req.query.classId];

	const data: AssignmentObject[] = [];

	db.query(sql, params)
		.on("result", (row: AssignmentObject, index: number) => data.push(row))
		.on("error", (err: MysqlError) => next(err))
		.on("end", () => res.send({ data }));
};

const postHandler: RequestHandler = (req, res, next) => {
	let sql =
		"INSERT INTO assignments(user, title, score, totalpoints, student_id, class_id) VALUES ";
	const params = String(req.body.scores).split(",");

	for (
		let numberOfAssignments = 0;
		numberOfAssignments < params.length;
		numberOfAssignments++
	) {
		if (numberOfAssignments % 6 === 0) {
			let userIndex = params.findIndex((element) => {
				return element === "user";
			});
			params[userIndex] = req.sessionID;

			sql += "( ?, ?, ?, ?, ?, ?),";
		}
	}
	sql = sql.slice(0, sql.length - 1);

	let data: OkPacket;

	db.query(sql, params)
		.on("result", (result: OkPacket) => (data = result))
		.on("error", (err: MysqlError) => next(err))
		.on("end", () => res.send({ data }));
};
const patchHandler: RequestHandler = (req, res, next) => {
	const scores = req.body.scores;
	const params = [];
	let sql = "UPDATE assignments SET score = CASE id ";

	for (let assignmentID in scores) {
		params.push(assignmentID);
		params.push(scores[assignmentID]);
		sql += "WHEN ? THEN ? ";
	}

	sql += "END WHERE id IN (";

	for (let assignmentID in scores) {
		params.push(assignmentID);
		sql += "?, ";
	}

	sql = sql.slice(0, sql.length - 2);
	sql += ")";

	sql = db.format(sql, params);

	let data: OkPacket;

	db.query(sql, params)
		.on("result", (result: OkPacket) => (data = result))
		.on("error", (err: MysqlError) => next(err))
		.on("end", () => res.send({ data }));
};

const router = Router();
router
	.route("/assignments")
	.get(getHandler)
	.post(postHandler)
	.patch(patchHandler);

export default router;
