const express = require('express');
const BodyParser = require('body-parser')
const server = express();
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const creds = require('./mysql_credentials.js');
const session = require('express-session');
const parseurl = require('parseurl');

const db = mysql.createConnection(creds);

const htmlDirectory = path.join(__dirname, 'dist');
const staticMiddlewareFunction = express.static(htmlDirectory);

const sessionMiddleWare = session({
  secret: 'fP4nfWsjK39fbdIo9an4sFoJ3vYe8L12qPjce',
  saveUninitialized: true,
  resave: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', //run NODE_ENV = production pm2 start index.js when going live
    sameSite: true
  }
});


function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


server.set('trust proxy', 1);
server.use(BodyParser.json())
server.use(sessionMiddleWare);
server.use(staticMiddlewareFunction);


server.get('/api/classes', function (request, response, next) {
  if (!request.session.userid) {
    request.session.userid = makeid(9);
  } else {
    var userid = request.session.userid;
  }

  let params = [];
  const id = request.url.split('=')[1];

  params.push(userid);
  if (!id){
    var query = `SELECT * FROM classes WHERE user = ?`;
  } else {
    params.push(id);
    query = `SELECT * FROM classes WHERE id = ? AND user = ?`;
  }
  db.query(query, params, function (error, data, fields) {
    if (error) return next(error);
    response.send({
        success: true,
        data,
        session: request.session.userid
    });
  });
});


server.get('/api/students', function (request, response, next) {
  if (!request.session.userid) {
    request.session.userid = makeid(9);
  } else {
    var userid = request.session.userid;
  }
  let params = [];

  const queryType = request.url.split('=')[0].split('?')[1];
  const id = request.url.split('=')[1];

  params.push(id);
  params.push(userid);


  if (queryType === 'class_id') {
    var query = `SELECT * FROM students WHERE class_id=? AND user=?`;
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

server.get('/api/assignments', function (request, response, next) {
  if (!request.session.userid) {
    request.session.userid = makeid(9);
  } else {
    var userid = request.session.userid;
  }
    let params = [];

    const student_id = request.url.split('=')[1];

    params.push(student_id);
    params.push(userid);

    const query = `SELECT * FROM assignments WHERE student_id=? AND user=?`;

    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.post('/api/students', function (request, response, next) {
  if (!request.session.userid) {
    request.session.userid = makeid(9);
  } else {
    var userid = request.session.userid;
  }
    let params = [];

    const student_name = request.body.name;
    const class_id = request.body['class_id'];

    params.push(userid);
    params.push(student_name);
    params.push(class_id);

    const query = `INSERT INTO students (user, name, class_id) VALUES (?,?,?)`;
    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});

server.delete('/api/students', function (request, response, next) {
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

server.delete('/api/classes', function (request, response, next) {
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

server.post('/api/assignments', function (request, response, next) {
  if (!request.session.userid) {
    request.session.userid = makeid(9);
  } else {
    var userid = request.session.userid;
  }
  let params = [];
  let query = "INSERT INTO assignments(user, title, score, totalpoints, student_id, class_id) VALUES (";

  params.push(userid);
  params.concat(request.body.scores.split(','));

  for(let assignmentsIndex = 0; assignmentsIndex < params.length; assignmentsIndex++){

    if ((assignmentsIndex % 6 - 5) === 0) {
      query += ' ?), (';
    } else {
      query += ' ?,';
    }
  }
  query = query.slice(0, query.length - 3);


  db.query(query, params, function (error, data, fields) {
    if (error) return next(error);
      response.send({
        success: true,
        data
      });
  });
});

server.post('/api/classes', function (request, response, next) {
  if (!request.session.userid) {
    request.session.userid = makeid(9);
  } else {
    var userid = request.session.userid;
  }
    let params = [];

    params.push(userid);
    params.push(request.body.name);

    const query = `INSERT INTO classes(user, title) VALUES (?,?)`;
    db.query(query, params, function (error, data, fields) {
      if (error) return next(error);
        response.send({
          success: true,
          data
        });
    });
});



server.patch('/api/assignments', function (request, response, next) {
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
