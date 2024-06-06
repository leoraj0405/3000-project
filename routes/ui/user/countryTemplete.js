var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.get('/', async function (req, res) {
    const {countryId} = req.query;
    const url2 = new URL (`http://localhost:3000/api/state?countryId=${countryId}`)

    var url = new URL(`http://localhost:3000/api/country`);
    const response = await fetch(url.href);
    const result = await response.json();
    var pageTotal = Math.ceil(result.total/result.limit)
    res.render('pages/countryUi/countryList', { ...result,pageTotal })
})

router.get('/addCountry/', function (req, res) {
    res.render('pages/countryUi/addCountry', { data: {} });
});

router.get('/edit/:countryId/', async function (req, res) {
    var id = req.params.countryId;
    const response = await fetch(`http://localhost:3000/api/country/${id}`);
    const data = await response.json();
    res.render('pages/countryUi/addCountry', { data });
});

module.exports = router;