@echo off
echo Removing node_modules and package-lock.json...
rmdir /s /q node_modules
del package-lock.json

echo Reinstalling dependencies...
call npm install

echo Dependencies reinstalled successfully!
