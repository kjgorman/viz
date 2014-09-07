/* jshint asi:true, expr:true, laxcomma:true */
+function () {
    'use strict';

    var Xero      = require('xero')
      , fs        = require('fs')
      , _instance = instance()

    function instance () {
        var privateKey = fs.readFileSync("keys/privatekey.pem")
          , key        = fs.readFileSync("keys/key.txt", "utf8").slice(0, 30)
          , secret     = fs.readFileSync("keys/secret.txt","utf8").slice(0, 30)

        return new Xero(key, secret, privateKey)
    }

    function invoices () {
        var _cache = null
        return function (callback) {
            if (_cache) return callback(null, _cache)

            _instance.call('GET', '/Invoice', null, function (err, res) {
                if (err) { console.log(err), callback(err) }

                _cache = res

                callback(null, res)
            })
        }
    }

    module.exports = { invoices : invoices() }
}()
