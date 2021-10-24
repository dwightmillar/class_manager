const db = require('../db/server.js')
const { Router } = require('express')
const router = Router()
const { queryCallback } = require('./utils.js')


router.route('/students')
    .get(async (req, res, next) => {
        let sql = `SELECT * FROM students WHERE user=? AND class_id=?`
        let params = []
    
        params.push(req.sessionID)
        params.push(req.query.classId)
    
        db.query(sql, params, async (error, data) => queryCallback(res, next, error, data))
    })
    .post(async (req, res, next) => {
        let sql = `INSERT INTO students (user, name, class_id) VALUES (?,?,?)`
        let params = []
    
        params.push(req.sessionID)
        params.push(req.body.name)
        params.push(req.body.classId)
    
        db.query(sql, params, async (error, data) => queryCallback(res, next, error, data))
    })
    .delete(async (req, res, next) => {
        let sql = `DELETE students, assignments FROM
                    students LEFT JOIN assignments ON
                    students.id = assignments.student_id
                    WHERE students.id=?`
        let params = []

        params.push(req.body.id)

        db.query(sql, params, async (error, data) => queryCallback(res, next, error, data))
    })



module.exports = router