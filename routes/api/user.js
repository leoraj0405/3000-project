
var express = require('express');
var router = express.Router();
var mysql = require('mysql')

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Root1234@',
  database: 'python_db_2'
});
con.connect(function (err) {
  if (err) throw err;
  console.log("connected")
});

const sortOptions = ['asc', 'desc']
const availableColumns = ['userId', 'firstName', 'lastName', 'examId', 'createdAt']

router.get('/', (req, res) => {
  const {
    page = 1,
    limit = 5,
    sort = 'createdAt',
    order = 'desc'
  } = req.query;
  const pageNo = isNaN(Number(page)) ? 1 : Number(page)
  const limitNo = isNaN(Number(limit)) ? 5 : Number(limit)

  if (sortOptions.includes(order) === false || availableColumns.includes(sort) === false) {
    res.status(400).send({ success: false, message: 'invalid input sort or order ' })
    return
  }
  con.query("select count(userId) as TotalStudents from user", function (er, resultTotal) {
    if (er) throw er;

    const total = resultTotal[0].TotalStudents
    const responseData = {
      data: [],
      page: pageNo,
      limit: limitNo,
      total,
      sortColumn: '',
      order: '',
    }
    if (total === 0) {
      return res.send(responseData)
    }
    const sqlQuery = /* sql */`
        select *, DATE_FORMAT(createdAt, '%D-%M-%Y') as createdAt 
        from user 
        order by ${sort} ${order} 
        limit ? 
        offset ?`
    con.query(sqlQuery, [limitNo, (pageNo - 1) * limitNo], function (errValue, resultValue) {
      if (errValue) {
        res.status(500).send({ success: false, errValue })
        return
      }
      //console.log(sort,order)
      responseData.data = (resultValue)
      responseData.sortColumn = sort
      responseData.order = order
      res.send(responseData)
    })
  })
})

router.post('/', (req, res) => {

  const {
    firstName,
    lastName,
    examId
  } = req.body

  con.query("insert into user(firstName, lastName, examId) values (?,?,?)", [firstName, lastName, examId], (err, row) => {
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

router.put('/:updateId', (req, res) => {

  const id = req.params.updateId;
  const {
    firstName,
    lastName,
    examId
  } = req.body

  con.query("update user SET firstName = ?,lastName = ?,examId = ? where userId = ?", [firstName, lastName, examId, id], (err, result) => {
    if (err) throw err;
    con.query("select * from user where userId = ?", [id], function (eror, resultData) {
      if (err) throw err;
      console.log(resultData)
      res.send(resultData[0])

    })
  })

})

router.delete('/:userId', (req, res) => {

  const id = req.params.userId;
  console.log(id)
  con.query("delete from user where userId = ?", [id], (err, resValue) => {
    if (err) throw err;
    res.send("deleted")
    //console.log(resValue)
  })
})

router.get('/:userId', (req, res) => {

  const id = req.params.userId;
  con.query("SELECT * FROM user where userId = ?", [id], function (err, resultVal) {
    if (err) throw err;
    res.send(resultVal[0]);
  });
})

module.exports = router;