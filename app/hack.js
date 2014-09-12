/* jshint asi:true, expr:true */
+function () {
    'use strict';

    function configure (app, xero) {
        app.get("/", function (req, res) {
            res.sendFile("views/index.html", { root : __dirname + "/../" })
        })

        app.get(/query\/(.+)/, function (req, res) {
            xero.query(req.params[0], function (err, results) {
                if (err) res.status(500).send("welp")
                res.send(results)
            })
        })
    }

    module.exports = { configure : configure }
}()
