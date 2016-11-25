#!/bin/bash
# 自动更新代码并自动提交代码到测试 OR 正式服务器

echo "---- 开始更新本地代码 ---- "$(date +%y年%m月%d日%H:%M:%S);
export LANG=zh_CN.UTF8

# 1. 从本地代码库更新代码
cd /home/code/aiqiumi
#svn info
svn update --username read --password read123

echo "---- 开始同步本地代码 ---- "$(date +%y年%m月%d日%H:%M:%S);

# 2. 将已更新代码与远程服务器进行同步操作
cd /home/shell
rsync -avu --delete --exclude-from="exclude.txt" -e "ssh -p 13659  -i ./keys/tes                                                                                                                                                             t_host_rsa" /home/code/aiqiumi/ root@121.43.104.142:/data/code/aqm/
rsync -avu --delete --exclude-from="exclude.txt" -e "ssh -p 13659  -i ./keys/tes                                                                                                                                                             t_host_rsa" /home/code/aiqiumi/ root@121.43.104.142:/data/code/aqm_preview/
rsync -avu --delete --exclude-from="exclude.txt" -e "ssh -p 13659  -i ./keys/tes                                                                                                                                                             t_host_rsa" /home/code/aiqiumi/ root@121.43.104.142:/data/code/aqm_worker/

echo "---- 执行完毕 ----";

[root@localhost shell]# cat r_test_host.sh
#!/bin/bash
# 自动更新代码并自动提交代码到测试 OR 正式服务器

echo "---- 开始更新本地代码 ---- "$(date +%y年%m月%d日%H:%M:%S);
export LANG=zh_CN.UTF8

# 1. 从本地代码库更新代码
cd /home/code/aiqiumi
#svn info
svn update --username read --password read123

echo "---- 开始同步本地代码 ---- "$(date +%y年%m月%d日%H:%M:%S);

# 2. 将已更新代码与远程服务器进行同步操作
cd /home/shell
rsync -avu --delete --exclude-from="exclude.txt" -e "ssh -p 13659  -i ./keys/test_host_rsa" /home/code/aiqiumi/ root@121.43.104.142:/data/code/aqm/
rsync -avu --delete --exclude-from="exclude.txt" -e "ssh -p 13659  -i ./keys/test_host_rsa" /home/code/aiqiumi/ root@121.43.104.142:/data/code/aqm_preview/
rsync -avu --delete --exclude-from="exclude.txt" -e "ssh -p 13659  -i ./keys/test_host_rsa" /home/code/aiqiumi/ root@121.43.104.142:/data/code/aqm_worker/

echo "---- 执行完毕 ----";
