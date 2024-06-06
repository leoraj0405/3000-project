var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.get('/', async function (req, res, next) {
  const {
    page: pageInput,
    limit: limitInput,
    order: orderInput,
    sort: sortInput
  } = req.query

  var url = new URL("http://localhost:3000/api/user");
  pageInput && url.searchParams.append('page', pageInput);
  limitInput && url.searchParams.append('limit', limitInput);
  orderInput && url.searchParams.append('order', orderInput);
  sortInput && url.searchParams.append('sort', sortInput);

  const response = await fetch(url.href);
  const {
    data,
    page,
    total,
    limit,
    order,
    sortColumn,
  } = await response.json();
  console.log(data)
  var pagesTotal = Math.ceil(total / limit)
  res.render('pages/userUi/listUser', { data, pagesTotal, limit, pageNum: page,order,sort: sortColumn });
  console.log(order)
});

router.get('/add', function (req, res) {
  res.render('pages/userUi/form', {data: {}});
});

router.get('/edit/:userId', async function (req, res) {
  var id = req.params.userId;
  const response = await fetch('http://localhost:3000/api/user/' +id);
  const data = await response.json();
  //console.log(data)
  res.render('pages/userUi/form',{data});
});

module.exports = router;
