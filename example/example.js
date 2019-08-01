let csvify = require('..') //@sighmir/csvify
let request = require('request')

request.get('https://jsonplaceholder.typicode.com/users', (error, response, body) => {
  let csv = csvify(body)
  console.log(body)
  console.log('===========================================')
  console.log(JSON.stringify(csv, null, 2))
  console.log('===========================================')
  console.log(csv.text())
  csv.save('output.csv')
})

