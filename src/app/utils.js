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