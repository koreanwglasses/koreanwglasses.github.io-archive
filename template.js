module.exports = ({command, externals, title, mainScript, redirect}) =>
redirect ? 
`<head>
    <title>Redirecting...</title>
</head>
<body>
    This page has been moved to ${redirect}. Redirecting...
    <script>
        window.location = '${redirect}'
    </script>
</body>
` :
`<head>
    <link href="https://fonts.googleapis.com/css?family=Inconsolata&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="/resources/css/styles.css">
    <link rel="stylesheet" type="text/css" href="/resources/css/console.css">
    <link rel="stylesheet" type="text/css" href="/resources/css/prism.css">

    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.5" />
    <title>Fred Choi: ${title}</title>

    <script type="text/javascript" async
        src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML">
    </script>
    <script src="https://kit.fontawesome.com/4c6205e508.js"></script>
    ${externals}
</head>
<body>
    <noscript>This is a dynamic website that relies heavily on JavaScript 
        for animations and interactivity. For the best experience, please enable
        JavaScript in your browser</noscript>
    <div id="root"></div>
    ${mainScript}
    <div id="preload-01"/>
    <div id="preload-02"/>
    <script>
        window.onload = function() {
            TerminalApp.start(${command ? "'" + command + "'" : ""});
        }
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.16.0/prism.min.js"></script>
</body>`