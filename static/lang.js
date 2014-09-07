/* jshint asi:true, expr:true */
+function () {

    Array.prototype.first = function () {
        return this[0]
    }

    Array.prototype.flatMap = function (f) {
        return this.concat.apply([], this.map(f))
    }

    window.id = function (x) { return x }
}()
