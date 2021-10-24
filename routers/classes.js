const db = require('../db/server.js')
const { Router } = require('express')
const router = Router()
const { queryCallback } = require('./utils.js')


router.route('/classes')
    .get(async (req, res, next) => {
        let sql = `SELECT * FROM classes WHERE user = ?`
        let params = []
        
        params.push(req.sessionID)
                    
        db.query(sql, params, async (error, data) => queryCallback(res, next, error, data))
    })
    .post(async (req, res, next) => {
        let sql = `INSERT INTO classes(user, title) VALUES (?,?)`
        let params = []
        
        params.push(req.sessionID)
        params.push(req.body.name)
    
        db.query(sql, params, async (error, data) => queryCallback(res, next, error, data))
    })
    .delete(async (req, res, next) => {
        let sql = `DELETE classes, students, assignments
                    FROM classes
                    LEFT JOIN students on classes.id = students.class_id
                    LEFT JOIN assignments on assignments.class_id = students.class_id
                    WHERE classes.id = ?`
        let params = []

        params.push(req.body.id)
    
        db.query(sql, params, async (error, data) => queryCallback(res, next, error, data))
    })


module.exports = router