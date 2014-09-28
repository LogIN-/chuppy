#!/bin/sh
# @Author: LogIN
# @Date:   2014-09-28 11:23:33
# @Last Modified by:   LogIN
# @Last Modified time: 2014-09-28 11:23:53
echo "WebKit build: Started"
cd ./application
#zip all files to nw archive
echo "WebKit build: zip all files to nw archive..."
/usr/bin/zip -r -1 -q ../builds/temp/Chuppy.nw ./*
#copy nw.pak from current build node-webkit
/bin/cp ../builds/cache/0.10.3/linux32/nw.pak ../builds/temp/nw.pak
#compilation to executable form
echo "WebKit build: compilation to executable form..."
/bin/cat ../builds/cache/0.10.3/linux32/nw ../builds/temp/Chuppy.nw > ../builds/Chuppy/linux32/Chuppy && /bin/chmod +x ../builds/Chuppy/linux32/Chuppy
#move nw.pak to build folder
/bin/mv ../builds/temp/nw.pak ../builds/Chuppy/linux32/nw.pak
#remove my-app.nw
/bin/rm ../builds/temp/Chuppy.nw

## COPY Other DEPS
/bin/cp ../builds/cache/0.10.3/linux32/icudtl.dat ../builds/Chuppy/linux32/icudtl.dat
/bin/cp ../builds/cache/0.10.3/linux32/libffmpegsumo.so ../builds/Chuppy/linux32/libffmpegsumo.so
/bin/cp ../application/credits.html ../builds/Chuppy/linux32/credits.html
echo "WebKit build: DONE"
#cp ./libraries/win/ffmpegsumo.dll ./builds/Chuppy/win/Chuppy/ffmpegsumo.dll
#cp ./libraries/mac/ffmpegsumo.so ./builds/Chuppy/mac/Chuppy.app/Contents/Frameworks/node-webkit Framework.framework/Libraries/ffmpegsumo.so
#cp ./libraries/linux64/ffmpegsumo.so ./builds/Chuppy/linux64/Chuppy/libffmpegsumo.so
#cp ./libraries/linux32/ffmpegsumo.so ./builds/Chuppy/linux32/libffmpegsumo.so
