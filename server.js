const express = require('express');
const BodyParser = require('body-parser')
const server = express();
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const creds = require('./mysql_credentials.js');

const db = mysql.createConnection(creds);



server.use(BodyParser.json())
server.use(BodyParser.urlencoded({ extended: true }))


const htmlDirectory = __dirname + 'index.html';
const staticMiddlewareFunction = express.static(path.join(htmlDirectory));

server.use(staticMiddlewareFunction);

server.get('/api/getclasses', function (request, response, next) {
  let params = [];

  if (request._parsedUrl.query){
    params.push(request._parsedUrl.query);
    var query = `SELECT * FROM 'classes' WHERE ?`;

  } else {
    query = `SELECT * FROM 'classes'`;
  }
  db.query(query, params, function (error, data, fields) {
    if (error) return next(error);
    response.send({
        success: true,
        data
    });
  });
});


server.get('/api/getstudents', function (request, response, next) {
  let params = [];

  params.push(request._parsedUrl.query);

  const query = `SELECT * FROM 'students' WHERE ?`;

  db.query(query, params, function (error, data, fields) {
  if (error) return next(error);
    response.send({
      success: true,
      data
    });
  });
});

server.get('/api/getassignments', function (request, response, next) {
    let params = [];

    params.push(request._parsedUrl.query);

    const query = `SELECT * FROM 'assignments' WHERE ?`;

    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.post('/api/addstudent', function (request, response, next) {
    let params = [];

    params.push(request.body.name);
    params.push(request.body['class_id']);

    const query = `INSERT INTO students (name, class_id) VALUES (\"?\",?)`;
    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.delete('/api/deletestudent', function (request, response, next) {
    let params = [];

    params.push(request.body.id);

    var query = `DELETE students, assignments FROM students INNER JOIN assignments ON students.id = assignments.student_id WHERE students.id = ?`;

    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.delete('/api/deleteclass', function (request, response, next) {
    let params = [];

    params.push(request.body.id);

    var query = `DELETE classes, students, assignments
                  FROM classes
                  LEFT JOIN students on classes.id = students.class_id
                  LEFT JOIN assignments on assignments.class_id = students.class_id
                  WHERE classes.id = ?`

    console.log(query);
    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.post('/api/addassignment', function (request, response, next) {
    let params = [];

    params.push(request.body.scores);

    const query = ` INSERT INTO assignments
                      (title, score, totalpoints, student_id, class_id)
                    VALUES
                      ?`;
    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.post('/api/addclass', function (request, response, next) {
    const title = JSON.stringify(request.body.name);
    let params = [];

    params.push(title);

    const query = `INSERT INTO classes(title) VALUES (?)`;
    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});



server.patch('/api/updatescore', function (request, response, next) {
    const scores = request.body.scores;
    let formattedScores = '';
    let affectedIDs = '';
    let params = [];



    for (let assignmentID in scores) {
      formattedScores += `WHEN ${assignmentID} THEN ${scores[assignmentID]} `;
      affectedIDs += `${assignmentID}, `;
    }
    affectedIDs = affectedIDs.slice(0, -2);



    params.push(formattedScores, affectedIDs);
    const query = `UPDATE assignments SET score = CASE id ? END WHERE id IN (?)`;


    db.query(query, params, function (error, data, fields) {
      if(error) return next(error);
        response.send({
          success: true,
          data
        })
    })
})

server.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false
  });
})

server.listen(3001, function () { console.log('server is listening on port 3001') });
