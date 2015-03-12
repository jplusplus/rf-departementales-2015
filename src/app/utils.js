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

var getDptNameFromDptCode = (function() {
    var mapping = {
        "01" : "Ain",
        "02" : "Aisne",
        "03" : "Allier",
        "04" : "Alpes-de-Haute-Provence",
        "05" : "Hautes-Alpes",
        "06" : "Alpes-Maritimes",
        "07" : "Ardèche",
        "08" : "Ardennes",
        "09" : "Ariège",
        "10" : "Aube",
        "11" : "Aude",
        "12" : "Aveyron",
        "13" : "Bouches-du-Rhône",
        "14" : "Calvados",
        "15" : "Cantal",
        "16" : "Charente",
        "17" : "Charente-Maritime",
        "18" : "Cher",
        "19" : "Corrèze",
        "2A" : "Corse-du-Sud",
        "2B" : "Haute-Corse",
        "21" : "Côte-d’Or",
        "22" : "Côtes-d’Armor",
        "23" : "Creuse",
        "24" : "Dordogne",
        "25" : "Doubs",
        "26" : "Drôme",
        "27" : "Eure",
        "28" : "Eure-et-Loir",
        "29" : "Finistère",
        "30" : "Gard",
        "31" : "Haute-Garonne",
        "32" : "Gers",
        "33" : "Gironde",
        "34" : "Hérault",
        "35" : "Ille-et-Vilaine",
        "36" : "Indre",
        "37" : "Indre-et-Loire",
        "38" : "Isère",
        "39" : "Jura",
        "40" : "Landes",
        "41" : "Loir-et-Cher",
        "42" : "Loire",
        "43" : "Haute-Loire",
        "44" : "Loire-Atlantique",
        "45" : "Loiret",
        "46" : "Lot",
        "47" : "Lot-et-Garonne",
        "48" : "Lozère",
        "49" : "Maine-et-Loire",
        "50" : "Manche",
        "51" : "Marne",
        "52" : "Haute-Marne",
        "53" : "Mayenne",
        "54" : "Meurthe-et-Moselle",
        "55" : "Meuse",
        "56" : "Morbihan",
        "57" : "Moselle",
        "58" : "Nièvre",
        "59" : "Nord",
        "60" : "Oise",
        "61" : "Orne",
        "62" : "Pas-de-Calais",
        "63" : "Puy-de-Dôme",
        "64" : "Pyrénées-Atlantiques",
        "65" : "Hautes-Pyrénées",
        "66" : "Pyrénées-Orientales",
        "67" : "Bas-Rhin",
        "68" : "Haut-Rhin",
        "69" : "Rhône",
        "70" : "Haute-Saône",
        "71" : "Saône-et-Loire",
        "72" : "Sarthe",
        "73" : "Savoie",
        "74" : "Haute-Savoie",
        "75" : "Paris",
        "76" : "Seine-Maritime",
        "77" : "Seine-et-Marne",
        "78" : "Yvelines",
        "79" : "Deux-Sèvres",
        "80" : "Somme",
        "81" : "Tarn",
        "82" : "Tarn-et-Garonne",
        "83" : "Var",
        "84" : "Vaucluse",
        "85" : "Vendée",
        "86" : "Vienne",
        "87" : "Haute-Vienne",
        "88" : "Vosges",
        "89" : "Yonne",
        "90" : "Territoire de Belfort",
        "91" : "Essonne",
        "92" : "Hauts-de-Seine",
        "93" : "Seine-Saint-Denis",
        "94" : "Val-de-Marne",
        "95" : "Val-d’Oise",
        "971" : "Guadeloupe",
        "972" : "Martinique",
        "973" : "Guyane",
        "974" : "La Réunion",
        "976" : "Mayotte"
    };
    return function(dptCode) {
        return mapping[String(dptCode)];
    }
})();

var computeChartData = function(data) {
    var lastColumnData = _.omit(data, function(v, k) { return k.indexOf("BC") === 0; });

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
};

var computeChartDataAs = function(data, as) {
    var ret = [];

    // First seven
    for (var i = 0; i < 7; ++i) {
        if (as[i].color == null) { break; }
        ret.push({
            color : as[i].color,
            value : data[as[i].color].rapportExprime,
            label : as[i].label,
            tooltip : as[i].tooltip
        });
    }

    // Add a empty column
    ret.push({ value : 0 , label : "" });
    // Add the Abs + Blancs + Nuls column
    ret.push({
        label : "ABS",
        value : data.nuls.rapportInscrit + data.blancs.rapportInscrit + data.abstentions.rapportInscrit,
        tooltip : "Blancs et nuls : " + String(data.nuls.rapportInscrit + data.blancs.rapportInscrit) + "%",
        color : "BLANCSNULS"
    });
    ret.push({
        label : "ABS",
        value : data.abstentions.rapportInscrit,
        color : "ABS",
        tooltip : "Abstentions : " + String(data.abstentions.rapportInscrit) + "%"
    });

    return ret;
};