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

server.get('/api/getclasses', function (request, response) {
  db.connect(function () {
    const query = "SELECT * FROM `classes`";
    db.query(query, function (error, data, fields) {
      if (!error) {
        response.send({
          success: true,
          data
        });
      }
    });
  })
});


server.get('/api/getstudents', function (request, response) {
  db.connect(function () {
    const id = request._parsedUrl.query;
    const query = "SELECT * FROM `students` WHERE " + id;
    console.log('query: ',query);
    db.query(query, function (error, data, fields) {
      if (!error) {
        response.send({
          success: true,
          data
        });
      }
    });
  })
});

server.get('/api/getassignments', function (request, response) {
  db.connect(function () {
    const id = request._parsedUrl.query;
    const query = "SELECT * FROM `assignments` WHERE " + id;
    console.log('query: ', query);
    db.query(query, function (error, data, fields) {
      if (!error) {
        response.send({
          success: true,
          data
        });
      }
    });
  })
});

server.post('/api/addstudent', function (request, response) {
  db.connect(function () {
    const query = "INSERT INTO students (name, class_id) VALUES (\"" + request.body.name + "\"," + request.body['class_id'] + ")";
    console.log('query: ',query);
    db.query(query, function (error, data, fields) {
      if (!error) {
        response.send({
          success: true,
          data
        });
      }
    });
  })
});

server.post('/api/addassignment', function (request, response) {
  db.connect(function () {
    const query = ` INSERT INTO assignments
                      (title, score, totalpoints, student_id)
                    VALUES
                      ${request.body.scores}`;
    console.log('query: ', query);
    db.query(query, function (error, data, fields) {
      if (!error) {
        response.send({
          success: true,
          data
        });
      }
    });
  })
});


server.listen(3001, function () { console.log('server is listening on port 3001') });
