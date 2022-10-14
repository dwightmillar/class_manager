import { NextFunction } from "express";
import { MysqlError } from "mysql";

const databaseQueryCallback = (err: MysqlError, results: any) => {};

function queryCallback(
	res: any,
	next: NextFunction,
	error: MysqlError,
	data: any
) {
	if (error && error.code !== "ER_EMPTY_QUERY") return next(error);

	data = Array.isArray(data)
		? data.map((datapoint) => {
				let { class_id, user, ...rest } = datapoint;
				return rest;
		  })
		: data;

	if (!data) data = [];
	return res.send({ data });
}

export { queryCallback, databaseQueryCallback };
