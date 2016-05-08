# this isn't very safe! Could kill innocent processes...

netstat -nlp | grep 8888 | awk '{ print $7}' | sed s,/node,'', | xargs kill
netstat -nlp | grep 3030 | awk '{ print $7}' | sed s,/node,'', | xargs kill
