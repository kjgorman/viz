var express = require('express')
  , chalk = require('chalk')
  , hack = require('./app/hack')
  , xero = require('./app/xero')
  , app = express()

app.use("/static", express.static(__dirname + "/static"));

hack.configure(app, xero);

app.listen(8000, function () {
    console.log(chalk.cyan("up on 8000"));
});
