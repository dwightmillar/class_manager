const db = require('../db/server.js')
const { Router } = require('express')
const router = Router()
const { queryCallback } = require('./utils.js')


router.route('/assignments')
    .get(async (req, res, next) => {
        let sql = `SELECT * FROM assignments WHERE user=? AND class_id=?`
        let params = []
    
        params.push(req.sessionID)
        params.push(req.query.classId)
    
        db.query(sql, params, async (error, data) => queryCallback(res, next, error, data))
    })
    .post(async (req, res, next) => {
        let sql = "INSERT INTO assignments(user, title, score, totalpoints, student_id, class_id) VALUES "
        let params = String(req.body.scores).split(',')

        for (let numberOfAssignments = 0; numberOfAssignments < params.length; numberOfAssignments++){
      
          if ((numberOfAssignments % 6) === 0)
          {
            let userIndex = params.findIndex(element => {
              return element === 'user'
            })
            params[userIndex] = req.sessionID
      
            sql += '( ?, ?, ?, ?, ?, ?),'
          }
        }
        sql = sql.slice(0, sql.length - 1)
      
      
        db.query(sql, params, async (error, data) => queryCallback(res, next, error, data))
    })
    .patch(async (req, res, next) => {
        const scores = req.body.scores
        let params = []
        let sql = "UPDATE assignments SET score = CASE id "
    
        for (let assignmentID in scores) {
          params.push(assignmentID)
          params.push(scores[assignmentID])
          sql += "WHEN ? THEN ? "
        }
    
        sql += "END WHERE id IN ("
    
        for (let assignmentID in scores) {
          params.push(assignmentID)
          sql += "?, "
        }
    
        sql = sql.slice(0, sql.length - 2)
        sql += ')'
    
    
        sql = db.format(sql, params)
    
        db.query(sql, params, async (error, data) => queryCallback(res, next, error, data))
    })


module.exports = router