Set WShell = CreateObject("WScript.Shell")
WShell.Run "node server.js", 0, False
WScript.Sleep 2000
WShell.Run "chrome --app=http://localhost:5000"