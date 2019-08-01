# csvify #

**csvify** is a simple Javascript module to convert JSON Objects to CSV.

## Documentation ##
### Getting Started

If you are using Node.js, install csvify using npm:

```bash
$ npm install @sighmir/csvify
```

You can now require and use jsgrafana like so:

```js
let csvify = require('@sighmir/csvify')
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
```

### Browser

You can also load this script on your browser like so:

```html
<script src='https://cdn.jsdelivr.net/npm/@sighmir/csvify/csvify.js'></script>
```

You can now use the function csvify normally on the page, like you would on Node.js.

## License ##
```
csvify - A simple JSON Object to CSV converter.
Copyright (C) 2019  Guilherme Caulada (Sighmir)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
