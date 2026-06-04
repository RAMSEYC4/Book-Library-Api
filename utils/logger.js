// centralize your logging so you can control it from one file

const info = (...params) => {
  console.log(params)
}

const error = (...error) => {
  console.error(error)
}

module.exports = { info, error }
