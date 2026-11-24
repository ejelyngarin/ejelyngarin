@echo off
set "PORTFOLIO=%~dp0index.html"
start "" chrome "%PORTFOLIO%"
if errorlevel 1 start "" "%PORTFOLIO%"
