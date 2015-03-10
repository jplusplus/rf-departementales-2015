var getLabelFromNuance = (function() {
    var mapping = {
        "BC-EXG" :  "Extrême gauche",
        "BC-FG" :   "Front de Gauche",
        "BC-PG" :   "Parti de Gauche",
        "BC-COM" :  "PCF",
        "BC-SOC" :  "PS",
        "BC-UG" :   "Union de la Gauche",
        "BC-RDG" :  "Parti radical de gauche",
        "BC-DVG" :  "Divers gauche",
        "BC-VEC" :  "EELV",
        "BC-DIV" :  "Divers",
        "BC-MDM" :  "Modem",
        "BC-UC" :   "Union du Centre",
        "BC-UDI" :  "UDI",
        "BC-UMP" :  "UMP",
        "BC-UD" :   "Union de la Droite",
        "BC-DLF" :  "Debout la France",
        "BC-DVD" :  "Divers droite",
        "BC-FN" :   "FN",
        "BC-EXD" :  "Extrême droite"
    };

    return function(nuance) {
        return mapping[nuance];
    };
})();

var getColorFromNuance = (function() {
    var mapping = {
        "BC-EXG" :  "#660000",
        "BC-FG" :   "#a51c30",
        "BC-PG" :   "#bb3636",
        "BC-COM" :  "#cc0000",
        "BC-SOC" :  "#eb649c",
        "BC-UG" :   "#eda9c7",
        "BC-RDG" :  "#fac8cd",
        "BC-DVG" :  "#d7c0d0",
        "BC-VEC" :  "#52a45b",
        "BC-DIV" :  "#e2d9d9",
        "BC-MDM" :  "#f1a248",
        "BC-UC" :   "#99ccff",
        "BC-UDI" :  "#75addd",
        "BC-UMP" :  "#518dbb",
        "BC-UD" :   "#3f7292",
        "BC-DLF" :  "#21546e",
        "BC-DVD" :  "#d0e6f1",
        "BC-FN" :   "#2a353b",
        "BC-EXD" :  "#000000"
    };

    return function(nuance) {
        return mapping[nuance];
    };
})();

var computeChartData = function(data) {
    var lastColumnData = _.omit(data, function(v, k) { return k.indexOf("BC") === 0; });
    console.debug(lastColumnData);

    // Extract real data
    data = _.pick(data, function(v, k) { return k.indexOf("BC") === 0; });
    data = _.sortBy(_.map(data, function(v, k) {
        return { color : k , value : v.rapportExprime , label : getLabelFromNuance(k) };
    }), 'value').reverse();

    // Dissociate first 7 from the rest
    var firstSeven = _.slice(_.cloneDeep(data), 0, 7);
    var other = _.map(_.sortBy(_.slice(data, firstSeven.length), 'value'), function(v) {
        v.tooltip = v.label + " : " + String(v.value) + "%";
        v.label = "Autres";
        return v;
    });
    var otherSummedValue = _.reduce(other, function(a, b) { return a + b.value; }, 0);
    other = _.map(other, function(v, i) {
        var tmp = v.value;
        v.value = otherSummedValue;
        otherSummedValue -= tmp;
        return v;
    });

    firstSeven = firstSeven.concat(other);
    // Add a empty column
    firstSeven.push({ value : 0 , label : "" });
    // Add the Abs + Blancs + Nuls column
    firstSeven.push({
        label : "ABS",
        value : lastColumnData.nuls.rapportInscrit + lastColumnData.blancs.rapportInscrit + lastColumnData.abstentions.rapportInscrit,
        tooltip : "Blancs et nuls : " + String(lastColumnData.nuls.rapportInscrit + lastColumnData.blancs.rapportInscrit) + "%",
        color : "BLANCSNULS"
    });
    firstSeven.push({
        label : "ABS",
        value : lastColumnData.abstentions.rapportInscrit,
        color : "ABS",
        tooltip : "Abstentions : " + String(lastColumnData.abstentions.rapportInscrit) + "%"
    });

    return firstSeven;
}