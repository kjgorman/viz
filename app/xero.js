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

    function query () {
        var _cache = {}
        return function (qs, callback) {
            if (_cache[qs]) return callback(null, _cache[qs])

            _instance.call('GET', '/'+qs, null, function (err, res) {
                if (err) { console.log(err), callback(err) }

                _cache[qs] = res

                callback(null, res)
            })
        }
    }

    module.exports = {
        query    : query()
    }
}()
