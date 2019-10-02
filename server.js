const express = require('express');
const BodyParser = require('body-parser')
const server = express();
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const creds = require('./mysql_credentials.js');

const db = mysql.createConnection(creds);



server.use(BodyParser.json())

const htmlDirectory = path.join(__dirname , 'dist');
const staticMiddlewareFunction = express.static(htmlDirectory);

server.use(staticMiddlewareFunction);

server.get('/class_manager/classes', function (request, response, next) {
  let params = [];
  const id = request.url.split('=')[1];

  if (id){
    params.push(id);
    var query = `SELECT * FROM classes WHERE id = ?`;

  } else {
    query = `SELECT * FROM classes`;
  }
  db.query(query, params, function (error, data, fields) {
    if (error) return next(error);
    response.send({
        success: true,
        data
    });
  });
});


server.get('/class_manager/students', function (request, response, next) {
  let params = [];

  const queryType = request.url.split('=')[0].split('?')[1];
  const id = request.url.split('=')[1];

  params.push(id);


  if (queryType === 'class_id') {
    var query = `SELECT * FROM students WHERE class_id=?`;
  } else {
    query = `SELECT * FROM students WHERE id=?`;
  }




  db.query(query, params, function (error, data, fields) {
  if (error) return next(error);
    response.send({
      success: true,
      data
    });
  });
});

server.get('/class_manager/assignments', function (request, response, next) {
    let params = [];

    const student_id = request.url.split('=')[1];

    params.push(student_id);

    const query = `SELECT * FROM assignments WHERE student_id=?`;

    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.post('/class_manager/students', function (request, response, next) {
    let params = [];

    const student_name = request.body.name;
    const class_id = request.body['class_id'];

    params.push(student_name);
    params.push(class_id);

    const query = `INSERT INTO students (name, class_id) VALUES (?,?)`;
    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.delete('/class_manager/students', function (request, response, next) {
    let params = [];

    const student_id = request.body.id;

    params.push(student_id);

    const query = `DELETE students, assignments FROM
                students LEFT JOIN assignments ON
                students.id = assignments.student_id
                WHERE students.id=?`;

    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.delete('/class_manager/classes', function (request, response, next) {
    let params = [];

    const id = request.body.id;

    params.push(id);

    const query = `DELETE classes, students, assignments
                  FROM classes
                  LEFT JOIN students on classes.id = students.class_id
                  LEFT JOIN assignments on assignments.class_id = students.class_id
                  WHERE classes.id = ?`

    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.post('/class_manager/assignments', function (request, response, next) {
    let query = "INSERT INTO assignments(title, score, totalpoints, student_id, class_id) VALUES (";

    const assignments = request.body.scores.split(',');

    for(let assignmentsIndex = 0; assignmentsIndex < assignments.length; assignmentsIndex++){

      if ((assignmentsIndex % 5 - 4) === 0) {
        query += ' ?), (';
      } else {
        query += ' ?,';
      }
    }
    query = query.slice(0, query.length - 3);

    query = mysql.format(query, assignments);


    db.query(query, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.post('/class_manager/classes', function (request, response, next) {
    let params = [];

    params.push(request.body.name);

    const query = `INSERT INTO classes(title) VALUES (?)`;
    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});



server.patch('/class_manager/assignments', function (request, response, next) {
    const scores = request.body.scores;
    let params = [];
    let query = "UPDATE assignments SET score = CASE id ";

    for (let assignmentID in scores) {
      params.push(assignmentID);
      params.push(scores[assignmentID]);
      query += "WHEN ? THEN ? ";
    }

    query += "END WHERE id IN ("

    for (let assignmentID in scores) {
      params.push(assignmentID);
      query += "?, ";
    }

    query = query.slice(0, query.length - 2);
    query += ')';


    query = mysql.format(query, params);

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
