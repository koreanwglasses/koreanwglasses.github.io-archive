const template = require('./template')
const externals = `
    <script src="/node_modules/react/umd/react.development.js"></script>
    <script src="/node_modules/react-dom/umd/react-dom.development.js"></script>
`
module.exports = args => template({...args, externals});