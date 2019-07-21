module.exports = ({command, externals}) =>
`<head>
    <link rel="stylesheet" type="text/css" href="/resources/css/styles.css">
    <link rel="stylesheet" type="text/css" href="/resources/css/console.css">
    ${externals}
</head>
<body>
    <div id="root">This is a dynamic website that relies heavily on JavaScript 
        for animations and interactivity. For the best experience, please enable
        JavaScript in your browser</div>
    <script src="/dev/js/scripts.js"></script>
    <script>
        window.onload = function() {
            TerminalApp.start(${command ? "'" + command + "'" : ""});
        }
    </script>
</body>`