const toSnakeCase = (string) => {
  return string.replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('_')
}

const extractIntFromString = (string) => {
  const regex = /\d+/ // Matches one or more digits
  const match = string.match(regex)
  return parseInt(match[0])
}
