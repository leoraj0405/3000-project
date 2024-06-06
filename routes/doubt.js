/*
function addWork() {
			const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
			var fName = ((document.getElementById('firstName')||{}).value)||"firstName";
			var lName =  ((document.getElementById('lastName')||{}).value)||"lastName";
			var xamid =  ((document.getElementById('examId')||{}).value)||"examId";
			const raw = JSON.stringify({
				"firstName": fName,
				"lastName": lName,
				"examId": xamid
			});
			const requestOptions = {
				method: "POST",
				headers: myHeaders,
				body: raw,
				redirect: "follow"
			};
			fetch("http://localhost:3000/api/user", requestOptions)
				.then((response) => response.text())
				.then((result) => console.log(result))
				.catch((error) => console.error(error));
		}*/

		if (sortOptions.includes(order) === false || availableColumns.includes(sort) === false) {
			res.status(400).send({ success: false, message: 'invalid input sort or order ' })
			return
		  }

		  router.get('/:id', (req, res) => {
			const id = req.params.id;
			try {
				con.query(`select * from country where sno = ${id}`, (err, resultData) => {
					res.send(resultData[0])
				})
			} catch (error) {
				console.error(error)
			}
		})
		