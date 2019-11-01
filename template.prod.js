const template = require('./template')
const externals = `
    <script src="/lib/react.production.min.js"></script>
    <script src="/lib/react-dom.production.min.js"></script>
`
const mainScript = '<script src="/js/scripts.js"></script>'
module.exports = args => template({...args, externals, mainScript});