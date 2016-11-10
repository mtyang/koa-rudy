/*
* @Author: enzo
* @Date:   2016-11-08 15:02:53
* @Last Modified by:   enzo
* @Last Modified time: 2016-11-10 11:04:15
*/

const debug = require('debug')('rudy:router');

const router = require('koa-router')();
const path = require('path');
const fs = require('fs');
const util = require('../../assets/util');

const root = path.join(__dirname, '../../app/demo/controller');

const routerReg = /\/?(\w*).js/;
const methodReg = /([get|post|del|put]*):?(:?.*)/;

module.exports = function(_root){

    _root = root;

    util.pathls(_root).forEach(function(filePath) {

        if (!/([a-zA-Z0-9_\-]+)(\.js)$/.test(filePath)) {
          return;
        }

        // router path
        let rootPath = filePath.match(routerReg)[1];
        // require module
        let exportFuncs = require(filePath);

        let appRoot = '/';

        Object.keys(exportFuncs).forEach(item => {
            let pathparss = item.match(methodReg);
            let method = pathparss[1];
            let routername = pathparss[2];
            let routerfn = exportFuncs[item];

            method ? '' : method = 'get';
            routername ? routername = rootPath+routername : rootPath;

            routername = appRoot+routername;

            console.log(routername);

            router[method](routername, routerfn);
        })

    });

    return router.routes()
};