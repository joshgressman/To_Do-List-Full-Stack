var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/todo';

router.get('/', function(req, res) {
  // Retrieve task from database
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM tasks', function (err, result) {
      done(); // we are done with our connection, let's close the connetion, I only have 10!
      // if we don't do done, nothing happens and it doesn't close the connection.

      if (err) {
        res.sendStatus(500);
      }

      res.send(result.rows);
    });
  });
});

router.post('/', function(req, res){
  //task objecct
  var task = req.body;
  console.log('req', req.body);
  pg.connect(connectionString, function (err,client,done){
    if(err){
      res.sendStatus(500);
    }
    client.query('INSERT INTO tasks (task, completed)'
    + 'VALUES($1, $2)',
     [task.task, task.completed],
      function(err, result){
        done();
        if(err){
          res.sendStatus(500);
        }
          res.sendStatus(201);
      });
  });
});

router.post('/delete/', function (req, res) {
  // console.log('req.param.id', typeof req.body.id);
  var id = parseInt(req.body.id);
  pg.connect(connectionString, function (err, client, done){

    if(err){
      res.sendStatus(500);
      console.log("This is the problem");
    }
    else {
    client.query('DELETE FROM tasks ' +
                 'WHERE id = ($1)', [id],
                   function (err, result){
                    done();
                    if(err){
                      console.log(err);
                      res.sendStatus(500);
                      return;
                    }
                    res.sendStatus(200);
                  });
                }
  });
});

router.put('/update/', function (req, res) {
  // console.log('req.param.id', req.body.id);
  var id = parseInt(req.body.id);
  pg.connect(connectionString, function (err, client, done){

    if(err){
      res.sendStatus(500);
      console.log("This is the problem");
    }
    else {
    client.query('UPDATE tasks ' +
                 'SET completed = TRUE ' +
                  'WHERE id = ($1)', [id],
                   function (err, result){
                    done();
                    if(err){
                      console.log(err);
                      res.sendStatus(500);
                      return;
                    }
                    res.sendStatus(200);
                  });
                }
  });
});


// router.post('list/update', function(req, res){
//   var task = req.body;
//   console.log('update task', task);
//   pg.connect(connectionString, function (err,client,done){
//     if(err) {
//       res.sendStatus(500);
//     }
//     client.query('UPDATE tasks'
//                   + 'SET completed = TRUE',
//           function(err,result) {
//             done();
//           if(err) {
//             console.log('err', err);
//             res.sendStatus(500);
//           } else {
//             res.sendStatus(201);
//           }
//         });
//   });
// });




module.exports=router;
