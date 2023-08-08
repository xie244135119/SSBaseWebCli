#!/usr/bin/env sh
###
 # @Author: Murphy.xie
 # @Date: 2022-06-07 17:28:51
 # @LastEditors: Murphy.xie
 # @LastEditTime: 2023-08-07 18:07:13
 # @Description: 
### 

set -e

set port 36000
port=36000
serveruser=xxx
serverhost=xxxx
serverpassword=xxxx
hostFilePath=xxxx

echo "开始打包..."
npm run build
tar zcvf dist.tar.gz dist/
echo "开始上传..."
sshpass -p $serverpassword scp -P $port  -o StrictHostKeyChecking=no "`pwd`/dist.tar.gz" $serveruser@$serverhost:$hostFilePath
sshpass -p $serverpassword ssh -p $port  -o StrictHostKeyChecking=no $serveruser@$serverhost << eeooff
cd /data/app/tools/nginx/html
ls
rm -rf dist_last_bak.tar.gz
tar zcvf dist_last_bak.tar.gz dist_bak/
rm -rf dist_bak/
mv dist/ dist_bak/
tar zxvf dist.tar.gz
rm -rf dist.tar.gz
eeooff
rm -rf dist.tar.gz
echo "部署结束"


