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

const availableColumns = ['adminId', 'firstName', 'lastName', 'dob']
const sortOptions = ['asc', 'desc']

router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      sort = 'adminId',
      order = 'desc',
      searchFirstName = '',
      searchLastName = '',
      searchdob = '',
      searchAdminId = ''
    } = req.query;
    const pageNo = isNaN(Number(page)) ? 1 : Number(page)
    const limitNo = isNaN(Number(limit)) ? 5 : Number(limit)

    let sqlCountQurey = `select count(adminId) as totalAdmin from admin`

    const condtions = []
    if (searchFirstName) {
      condtions.push(`firstName LIKE '%${searchFirstName}%'`)
    }
    if (searchLastName) {
      condtions.push(`lastName LIKE '%${searchLastName}%'`)
    }
    if (searchdob) {
      condtions.push(`dob = '${searchdob}'`)
    }
    if (searchAdminId) {
      condtions.push(`adminId LIKE'%${searchAdminId}%'`)
    }
    const conditionsStr = condtions.length ? ` WHERE ${condtions.join(' AND ')}` : ''
    sqlCountQurey += conditionsStr
    con.query(sqlCountQurey, (err, resultValue) => {
      const total = resultValue[0].totalAdmin;
      const responseData = {
        data: [],
        total,
        page: pageNo,
        limit: limitNo,
        sort: '',
        order: '',
        searchAdminId: '',
        searchFirstName: '',
        searchLastName: '',
        searchDob: '',
      }
      //console.log(sqlCountQurey)

      const sqlSelectQurey = `select *, DATE_FORMAT(dob, '%D-%M-%Y') as dob from admin ${conditionsStr} order by ${sort} ${order} limit ? offset ?`
      con.query(sqlSelectQurey, [limitNo, (pageNo - 1) * limitNo], function (err, result) {
        //console.log(sqlSelectQurey)

        if (err) throw err;
        responseData.data = result;
        responseData.sort = sort;
        responseData.order = order;
        responseData.searchAdminId = searchAdminId;
        responseData.searchFirstName = searchFirstName;
        responseData.searchLastName = searchLastName;
        responseData.searchDob = searchdob;
        res.send(responseData)
      })
    })
  } catch (error) {
    console.error(error)
  }
})

router.post('/', (req, res) => {
  const {
    firstName,
    lastName,
    dob,
    password
  } = req.body

  try {
    con.query('insert into admin (firstName, lastName, dob,password) values (?,?,?,?)', [firstName, lastName, dob, password], function (err, result) {
      console.log(result)
      res.send("insert successfully")
    })
  } catch (error) {
    console.error(error)
  }
})

router.put('/:upateId', (req, res) => {
  const id = req.params.upateId;
  const {
    firstName,
    lastName,
    dob,
    password,
  } = req.body
  try {
    con.query('UPDATE admin SET firstName = ?, lastName = ?, dob = ?, password = ?  WHERE adminId = ?', [firstName, lastName, dob, password, id], (err, result) => {
      if (err) {
        console.error(err)
      }
      con.query("select * from admin where adminId = ?", [id], (eror, resultData) => {
        res.send(resultData[0])
      })
    })
  } catch (error) {
    console.error(error)
  }
})

router.delete('/:deleteId', (req, res) => {
  const id = req.params.deleteId;
  console.log(id)
  try {
    con.query('DELETE FROM admin WHERE adminId = ?', [id], (err, result) => {
      res.send('row deleted')
    })
  } catch (error) {
    console.error(error)
  }
})

router.post('/login', function (req, res) {
  const {
    id,
    password
  } = req.body;
  con.query('select adminId,firstName,lastName,dob from admin where adminId = ? and password  = ?', [id, password], function (err, result) {
    if (result.length > 0) {
      req.session.isLogged = true;
      req.session.data = result[0];
      // res.redirect('/home')
      // console.log(req.sessionID)
      // console.log(req.session)
      res.status(200).send('success')
    } else {
      req.session.isLogged = false;
      req.session.data = 'null44';
      res.status(409).send('Invalid admin ID  and/or Password')
    }
  })
})

router.get('/home', (req, res) => {
  if (req.session.isLogged) {
    const result = req.session.data;
    //  console.log(result[0])
    res.send(result);
  } else {
    res.send('Please login to view this page!');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.send('session destroy')
  });
});

router.get('/:dataId', (req, res) => {
  const id = req.params.dataId;
  try {
    con.query(`select *, DATE_FORMAT(dob, '%D-%M-%Y') as dob from admin where adminId = ${id}`, (err, result) => {
      res.send(result[0])
    })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router;