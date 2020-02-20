/*
 * 1. Parse command-line input
 * 2. Validate that it is a SQL SELECT command
 * 3. Read data from database
 * 4. Write data to file
 * 5. Verify data in file
 * 6. Delete data from database
 */

/* Allow for the database to start*/

const fs = require('fs')
const mysql = require('mysql')
const csv = require('csv-parser')

const outFile = 'Output.csv'

setTimeout(() => {
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

			fs.unlinkSync(outFile)
			writeToFile(result).then(v => verifyFile(result)).then(v => console.log('It is: ' + v))
		})
	})
}, 5 * 1000)

function writeToFile (sqlObjects) {
	return new Promise((res, rej) => {
		fs.appendFile(
			outFile,
			Object.keys(sqlObjects[0]).reduce((agr, cur) => agr + cur + ',', '').slice(0, -1) + '\n',
			err => {
				rej(err)
			}
		)

		sqlObjects.forEach(e => {
			let s = ''
			Object.keys(e).forEach(k => {
				s += e[k] + ','
			})
			fs.appendFile(outFile, s.slice(0, -1) + '\n', err => {
				if (err) rej(err)
			})
		})

		res()
		console.log('Saved!')
	})
}

function verifyFile (sqlObjects) {
	return new Promise((res, rej) => {
		let fileLength = 0
		let ret = true
		fs
			.createReadStream(outFile)
			.pipe(csv())
			.on('data', row => {
				let a = sqlObjects.some(e => {
					return JSON.stringify(row) === JSON.stringify(e)
				})
				fileLength++
				if (!a) {
					console.log(row, 'false')
					res('Halløj')
				}
			})
			.on('end', () => {
				console.log('Outfile.csv has been run through')
				console.log(fileLength, sqlObjects.length)
				res(fileLength === sqlObjects.length)
			})
	})
}
