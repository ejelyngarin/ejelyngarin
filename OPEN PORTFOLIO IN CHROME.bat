@echo off
setlocal
set "PORTFOLIO=%~dp0index.html"

if not exist "%PORTFOLIO%" (
    echo Portfolio index.html was not found in this folder.
    pause
    exit /b 1
)

set "CHROME="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "CHROME=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"

if not defined CHROME (
    for /f "delims=" %%C in ('where chrome.exe 2^>nul') do (
        set "CHROME=%%C"
        goto :launch
    )
)

:launch
if defined CHROME (
    start "" "%CHROME%" "%PORTFOLIO%"
) else (
    echo Google Chrome was not found. Opening the portfolio in your default browser instead.
    start "" "%PORTFOLIO%"
)
endlocal
