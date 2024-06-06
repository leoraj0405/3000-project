
var express = require('express');
var router = express.Router();
var mysql = require('mysql')

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Root1234@',
  database: 'python_db_2'
});


/* GET users listing. */

router.get('/index', (req, res) => {
  res.render('pages/user');
})
router.get('/', (req, res) => {
  con.connect(function (err) {
    if (err) throw err;
    console.log("connected")
    con.query("SELECT * FROM user", function (err, result) {
      if (err) throw err;
      res.send(result);
      
    });
  })
})

router.post('/', (req, res) => {

  var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root1234@',
    database: 'python_db_2'
  });

  const {
    firstName,
    lastName,
    examId
  } = req.body

  con.connect(function (err) {
    if (err) throw err;
    console.log("connected")
    con.query("insert into user(firstName, lastName, examId) values (?,?,?)", [firstName, lastName, examId], function (err, row) {
      con.destroy();
      if (err) {
        res.status(409).send(err)
      } else {
        res.status(201).send({
          userId: row.insertId,
          firstName,
          lastName,
          examId,
        })
      }
    });

  })
})

router.put('/', (req, res) => {
  res.send('Got a put request at /user')
})

router.delete('/', (req, res) => {
  res.send('Got a DELETE request at /user')
})

module.exports = router;
