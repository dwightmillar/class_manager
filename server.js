const express = require('express');
const BodyParser = require('body-parser')
const app = express();
const http = require('http');
const https = require('https');
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
    expires: 300000,
    secure: true,
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


app.set('trust proxy', 1);
app.use(BodyParser.json())
app.use(sessionMiddleWare);
app.use(staticMiddlewareFunction);


app.get('/api/classes', function (request, response, next) {
  if (!request.session.userid) {
    request.session.userid = makeid(9);
  } else {
    var userid = request.session.userid;
  }

  let params = [];
  const id = request.url.split('=')[1];
  var query = '';

  params.push(userid);
  if (!id){
    query = `SELECT * FROM classes WHERE user = ?`;
  } else {
    params.push(id);
    query = `SELECT * FROM classes WHERE id = ? AND user = ?`;
  }
  db.query(query, params, function (error, data, fields) {
    if (error) return next(error);
    response.send({
        success: true,
        data
    });
  });
});


app.get('/api/students', function (request, response, next) {
  if (!request.session.userid) {
    request.session.userid = makeid(9);
  } else {
    var userid = request.session.userid;
  }
  let params = [];

  const queryType = request.url.split('=')[0].split('?')[1];
  const id = request.url.split('=')[1];
  var query = '';

  params.push(id);
  params.push(userid);


  if (queryType === 'class_id') {
    query = `SELECT * FROM students WHERE class_id=? AND user=?`;
  } else {
    query = `SELECT * FROM students WHERE id=? AND user=?`;
  }




  db.query(query, params, function (error, data, fields) {
  if (error) return next(error);
    response.send({
      success: true,
      data
    });
  });
});

app.get('/api/assignments', function (request, response, next) {
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

app.post('/api/students', function (request, response, next) {
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

app.delete('/api/students', function (request, response, next) {
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

app.delete('/api/classes', function (request, response, next) {
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

app.post('/api/assignments', function (request, response, next) {
  if (!request.session.userid) {
    request.session.userid = makeid(9);
  } else {
    var userid = request.session.userid;
  }
  let params = [];
  let query = "INSERT INTO assignments(user, title, score, totalpoints, student_id, class_id) VALUES ";

  params = request.body.scores.split(',');

  for(let assignmentsIndex = 0; assignmentsIndex < params.length; assignmentsIndex++){

    if ((assignmentsIndex % 6) === 0) {
      let userIndex = params.findIndex(element => {
        return element === 'user';
      })
      params[userIndex] = userid;

      query += '( ?, ?, ?, ?, ?, ?),'
    }
  }
  query = query.slice(0, query.length - 1);


  db.query(query, params, function (error, data, fields) {
    if (error) return next(error);
      response.send({
        success: true,
        data
      });
  });
});

app.post('/api/classes', function (request, response, next) {
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



app.patch('/api/assignments', function (request, response, next) {
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

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false
  });
})

// http.createServer(app).listen(80);
https.createServer(app).listen(3001);

// app.listen(3001, function () { console.log('app is listening on port 3001') });
