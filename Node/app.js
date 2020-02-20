/*
 * 1. Parse command-line input
 * 2. Validate that it is a SQL SELECT command
 * 3. Read data from database
 * 4. Write data to file
 * 5. Verify data in file
 * 6. Delete data from database
 */

/* Allow for the database to start*/

setTimeout(() => {
	let mysql = require('mysql')

	/* Connect to mysql databse*/
	// TODO: Secure login information

	let con = mysql.createConnection({
		host: 'MySQL',
		user: 'root',
		password: 'example',
		database: 'cego'
	})

	con.connect(err => {
		if (err) throw err
		console.log('Connected')

		con.query(String(process.env.q), (err, result) => {
			if (err) throw err

			writeToFile(result)
		})
	})
}, 5 * 1000)

function writeToFile (sqlObjects) {
	let fs = require('fs')

	sqlObjects.forEach(e => {
		let s = ''
		Object.keys(e).forEach(k => {
			s += e[k] + '|'
		})
		fs.appendFile('Text.txt', s + '\n', err => {
			if (err) throw err
		})
	})
	console.log('Saved!')
}
