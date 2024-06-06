var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.get('/', async function (req, res) {
    const {
        page: pageInput,
        countryId,
        search,
    } = req.query;
    var url = new URL(`http://localhost:3000/api/state`);
    pageInput && url.searchParams.append('page', pageInput);
    countryId && url.searchParams.append('countryId', countryId);
    search && url.searchParams.append('search', search);

    const response = await fetch(url.href);
    const data = await response.json();

    data.Pagination = ['countryId='+data.countryId,'search='+data.searchValue].join('&')
    if(data.searchValue){
        data.filterQuery = ['countryId='+data.countryId].join('')
    }
    var url2 = new URL(`http://localhost:3000/api/country/name`);
    const response2 = await fetch(url2.href);
    const data2 = await response2.json();
    const manageState = 'No States'

    var pageTotal = Math.ceil(data.total / data.limit);
    res.render('pages/stateUi/stateList', { ...data, data2,pageTotal, manageState })
})

router.get('/addState', async function (req, res) {
    var url = new URL(`http://localhost:3000/api/country`);
    const response = await fetch(url.href);
    const result = await response.json();
    const pageName = 'ADD'
    res.render('pages/stateUi/addState', { data: {}, ...result, pageName})
})

router.get('/edit/:stateId/', async function (req, res) {
    var id = req.params.stateId;
    const response = await fetch(`http://localhost:3000/api/state/${id}`);
    const data = await response.json();

    var url = new URL(`http://localhost:3000/api/country`);
    const response2 = await fetch(url.href);
    const result = await response2.json();
    const pageName = 'EDIT'
    res.render('pages/stateUi/addState', { data, ...result, pageName, id });
});

router.get('/home')
module.exports = router;