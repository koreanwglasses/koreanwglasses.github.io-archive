const template = require('./template')
const externals = `
    <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
`
const mainScript = '<script src="/js/scripts.js"></script>'
module.exports = args => template({...args, externals, mainScript});