var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.get('/', async function (req, res, next) {
  const {
    page: pageInput,
    limit: limitInput,
    order: orderInput,
    sort: sortInput,
    searchAdminId: searchIdInput,
    searchFirstName: searchFirstNameInput,
    searchLastName: searchLastNameInput,
    searchdob: searchDobInput,
  } = req.query;
  var url = new URL('http://localhost:3000/api/admin');
  pageInput && url.searchParams.append('page', pageInput);
  limitInput && url.searchParams.append('limit', limitInput);
  orderInput && url.searchParams.append('order', orderInput);
  sortInput && url.searchParams.append('sort', sortInput);
  searchIdInput && url.searchParams.append('searchAdminId', searchIdInput);
  searchFirstNameInput && url.searchParams.append('searchFirstName', searchFirstNameInput);
  searchLastNameInput && url.searchParams.append('searchLastName', searchLastNameInput);
  searchDobInput && url.searchParams.append('searchdob', searchDobInput);

  const response = await fetch(url.href);
  const result = await response.json();

  result.paginationQs = ['limit=' + result.limit, 'order=' + result.order, 'sort=' + result.sort,].join('&')
  result.limitQs = ['page=' + result.page, 'order=' + result.order, 'sort=' + result.sort].join('&')
  result.orderQs = ['limit=' + result.limit]
  result.searchQs = []
  if (result.searchAdminId) {
    result.searchQs.push(`searchAdminId=${result.searchAdminId}`)
  }
  if (result.searchFirstName) {
    result.searchQs.push(`searchFirstName=${result.searchFirstName}`)
  }
  if (result.searchLastName) {
    result.searchQs.push(`searchLastName=${result.searchLastName}`)
  }
  if (result.searchDob) {
    result.searchQs.pudh(`searchdob=${result.searchDob}`)
  }
  const searchQsStr = 1 <= result.searchQs.length ? `${result.searchQs.join('&')}` : ``

  var pagesTotal = Math.ceil(result.total / result.limit)
  res.render('pages/adminUi/listAdmin', { ...result, pagesTotal, searchQsStr });
})
router.get('/addAdmin/', function (req, res) {
  res.render('pages/adminUi/adminForm', { data: {} });
});

router.get('/edit/:adminId/', async function (req, res) {
  var id = req.params.adminId;
  const response = await fetch('http://localhost:3000/api/admin/' + id);
  const data = await response.json();
 
  //console.log(data)
  res.render('pages/adminUi/adminForm', { data });
});

router.get('/login', async (req,res) => {
  res.render('pages/adminUi/login')
});

router.get('/home', async (req,res) => {
  if (req.session.isLogged == true){
    res.render('pages/adminUi/dashboard',{result : req.session.data})
  }else {
    // res.send('plese login !')
    res.redirect('http://localhost:3000/admin/login')
  }
  // console.log('test')
  // console.log(req.sessionID)
  // console.log(req.session)
  
})

router.get('/logout', async (req,res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('http://localhost:3000/admin/login');
  });
});

module.exports = router;