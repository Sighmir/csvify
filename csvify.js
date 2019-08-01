const csvify = (obj) => {
  try {
    obj = JSON.parse(typeof obj === 'string' ? obj : JSON.stringify(obj))
  } catch (err) {
    throw new err.constructor(`Invalid JSON object!\n${err}`)
  }

  let parsed = {}
  let result = {}

  const uncamel = (str) => {
    let aux = ''
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    if (str === str.toUpperCase()) str = str.toLowerCase()
    for (let c of str) {
      if (aux === '') aux += c.toUpperCase()
      else if (upper.includes(c) && !upper.includes(aux[aux.length])) aux += ` ${c}`
      else aux += c
    }
    return aux.replace(/\s+/g, ' ')
  }

  const unsnake = (str) => {
    let aux = ''
    let split = str.split('_')
    for (let i in split) {
      let s = split[i]
      for (let c of s) {
        if (aux === '' || aux.slice(-1)[0] === ' ') aux += c.toUpperCase()
        else aux += c
      }
      if (i != split.length - 1) aux += ' '
    }
    return aux.replace(/\s+/g, ' ')
  }

  const text = () => {
    let text = result.columns.join(',')
    if (isArray(result.values[0])) {
      for (let v of result.values) {
        text += `\n${v.join(',')}`
      }
    } else text += `\n${result.values.join(',')}`
    return text
  }

  const save = (output) => require('fs').writeFileSync(output, result.text())

  const format = (str) => str.includes('_') ? unsnake(str) : uncamel(str)

  const isArray = (obj) => obj.constructor.name === 'Array'

  const parse = (obj, p = '') => {
    if ((typeof obj != 'object') && p != '') {
      let k = format(p)
      if (parsed[k]) {
        parsed[k] += `; ${obj}`
      } else {
        if (typeof obj === 'number' && `${obj[k]}`.length >= 12) {
          obj = (new Date(obj)).toLocaleString('pt-BR').replace(',', '')
        }
        parsed[k] = `${obj}`.replace('\n', '').replace(',', ';')
      }
      return
    }

    for (let k in obj) {
      let pk = format(format(p) + format(k))
      if (typeof obj[k] != 'object') {
        if (parsed[pk]) {
          parsed[pk] += `; ${obj[k]}`
        } else {
          if (typeof obj[k] === 'number' && `${obj[k]}`.length >= 12) {
            obj[k] = (new Date(obj[k])).toLocaleString('pt-BR').replace(',', '')
          }
          parsed[pk] = `${obj[k]}`.replace('\n', '').replace(',', ';')
        }
      } else if (obj[k] == null) {
        if (!parsed[pk]) {
          parsed[pk] = ''
        }
      } else if (isArray(obj[k])) {
        for (let e of obj[k]) {
          parse(e, k)
        }
      } else {
        parse(obj[k], k)
      }
    }
    return parsed
  }

  const parseArray = (obj) => {
    let data = {}
    let values = []
    let columns = []
    let max = 0
    for (let i in obj) {
      parsed = {}
      let e = obj[i]
      let csv = csvify(e)
      for (let k in csv.data) {
        if (!data[k]) data[k] = []
        data[k][i] = csv.data[k]
      }
    }
    for (let k in data) {
      columns.push(k)
      data[k] = Array.from(data[k], ae => ae || '')
      let l = data[k].length
      if (l > max) max = l
      else if (l < max) {
        for (let j = l; j < max; j++) {
          data[k][j] = ''
        }
      }
      for (let i in data[k]) {
        if (!values[i]) values[i] = []
        values[i].push(data[k][i])
      }
    }
    return { values, columns, data, save, text }
  }

  if (isArray(obj)) {
    result = parseArray(obj)
  } else {
    let data = parse(obj)
    let values = Object.values(data)
    let columns = Object.keys(data)
    result = { values, columns, data, save, text }
  }

  return result
}

const isNode = () => typeof module !== 'undefined' && module.exports
if (isNode()) {
  module.exports = csvify
}