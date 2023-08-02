#!/usr/bin/env sh

set -e

# 配置项修改
port=22
serveruser=root
serverhost=0.0.0.0
serverpassword=123456
hostFilePath=xxxxxx

npm run build
zip -r dist.zip dist/
sshpass -p $serverpassword scp -P $port -o StrictHostKeyChecking=no "`pwd`/dist.zip" $serveruser@$serverhost:$hostFilePath
rm -rf dist.zip
sshpass -p $serverpassword ssh -p $port -o StrictHostKeyChecking=no $serveruser@$serverhost << eeooff
cd xxxxx
ls
rm -rf dist_bak.zip
zip -r dist_bak.zip dist_bak/
rm -rf dist_bak/
mv dist/ dist_bak/
unzip dist.zip 
rm -rf dist.zip
eeooff
echo "部署完成"

