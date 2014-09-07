/* jshint asi:true, expr:true */
+function () {
    'use strict';

    function configure (app, xero) {
        app.get("/", function (req, res) {
            res.sendFile("views/index.html", { root : __dirname + "/../" })
        })

        app.get("/invoices", function (req, res) {
            xero.invoices(function (err, invoices) {
                if (err) res.status(500).send("welp")
                res.send(invoices)
            })
        })
    }

    module.exports = { configure : configure }
}()
