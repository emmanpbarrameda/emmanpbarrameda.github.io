@echo off
setlocal enabledelayedexpansion

echo Renaming files...

for %%f in ("4portfolio_mmcmic_2025-07-02 *.webp") do (
    set "oldname=%%~nxf"

    rem Remove any known time blocks
    set "newname=!oldname: 18 58 48=!"
    set "newname=!newname: 18 58 49=!"

    rem Rename if different
    if not "!oldname!"=="!newname!" (
        if not exist "!newname!" (
            ren "%%f" "!newname!"
            echo Renamed: !oldname! → !newname!
        ) else (
            echo Skipped: !newname! already exists.
        )
    )
)

echo Done.
pause
