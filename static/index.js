/*jshint asi:true, expr:true, laxcomma:true */
+function () {
    'use strict';

    var stack  = d3.layout.stack()
      , width  = 960
      , margin = 10
      , height = 480

    var test = [{ Date: new Date("09/01/2014"), Total: "100", AmountPaid : "50" }
                , { Date: new Date("09/14/2014"), Total: "150", AmountPaid : "50" }]

    $.get('/query/invoices', function (res) {
        var invoices   = res.Response.Invoices.Invoice
          , receivable = sales(invoices)
          , payable    = sales(invoices)
          , bounds     = dateBounds(invoices)
          , layers     = stack(invoices.flatMap(computeStackValue(bounds)))
          , x = d3
            .scale
            .linear()
            .domain([0, width])
            .range([0, width])
          , xDate = d3.time.scale().domain([bounds.earliest, bounds.latest]).range([0, width])
          , xAxis = d3.svg.axis()
            .scale(xDate)
            .tickSize(0)
            .ticks(10)
            .tickPadding(height - 20)
            .orient("bottom")
          , y = d3
            .scale
            .linear()
            .domain([0, d3.max(layers, function (layer) {
                return d3.max(layer, function (d) { return d.y + d.height })
            })])
            .range([0, height])
          , svg = d3.select("body").append("svg")
            .attr("width", margin + width + margin)
            .attr("height", height)
          , layer = svg.selectAll(".layer")
              .data(layers)
            .enter().append("g")
              .attr("class", "layer")
              .style("fill", function(d, i) {
                  return d.first().is === "paid" ? "#5f5" : "#f99"
              })
          , rect = layer.selectAll("rect")
              .data(id)
            .enter().append("rect")
              .attr("x", function(d) { return x(d.x); })
              .attr("y", function (d) { return y(d.y) })
              .attr("width", 5)
              .attr("height", function (d) { return y(d.height) });

        svg.append("g")
            .attr("class", "x axis")
            .attr("font-size", "0.5em")
            .attr("fill", "#c5a45a")
            .call(xAxis)
    });

    function computeStackValue (bounds) {
        return function (invoice) {
            var x = computeOffset(invoice, bounds)
            return [[{
                x : x,
                y : 0,
                height: +invoice.AmountPaid,
                y0 : 0,
                is : "paid"
            }], [{
                x : x,
                y : +invoice.AmountPaid,
                height: (+invoice.Total) - (+invoice.AmountPaid),
                y0 : 0,
                is : "outstanding"
            }]]
        }
    }

    function computeOffset (invoice, bounds) {
        var time     = new Date(invoice.Date).getTime()
          , earliest = bounds.earliest.getTime()
          , latest   = bounds.latest.getTime()
          , delta    = latest - earliest

        return ((time - earliest) / delta) * width
    }

    function dateBounds (invoices) {
        var earliest = new Date(invoices.first().Date)
          , latest   = new Date(invoices.first().Date)

        invoices.forEach(function (invoice) {
            var invoiceDate = new Date(invoice.Date)

            if (invoiceDate < earliest) earliest = invoiceDate
            if (invoiceDate > latest)   latest = invoiceDate
        })

        return { earliest : earliest, latest : latest }
    }

    function sales (invoices) {
        return invoices.filter(function (invoice) { return invoice.Type === "ACCREC" })
    }

    function bills (invoices) {
        return invoices.filter(function (invoice) { return invoice.Type === "ACCPAY" })
    }
}()
