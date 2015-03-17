var getLabelFromNuance = (function () {
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

    return function (nuance) {
        return mapping[nuance];
    };
})();

var getColorFromNuance = (function () {
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

var getDptNameFromDptCode = (function () {
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

var computeChartData = function (data) {
    var lastColumnData = _.omit(data, function(v, k) { return k.indexOf("BC") === 0; });
    // Extract real data
    data = _.pick(data, function(v, k) { return k.indexOf("BC") === 0; });
    data = _.sortBy(_.map(data, function(v, k) {
        return { color : k , value : v.rapportExprime , label : getLabelFromNuance(k) , nombre : v.nombre , nom : v.nom };
    }), 'value').reverse();

    // Dissociate first 7 from the rest
    var firstSeven = _.slice(_.cloneDeep(data), 0, 7);
    var other = _.map(_.sortBy(_.slice(data, firstSeven.length), 'value'), function(v) {
        v.tooltip = v.label + " : " + String(Math.round(v.value * 10) / 10) + "%";
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
        tooltip : "Blancs et nuls : " + String(Math.round((lastColumnData.nuls.rapportInscrit + lastColumnData.blancs.rapportInscrit) * 10) / 10) + "%",
        color : "BLANCSNULS"
    });
    firstSeven.push({
        label : "ABS",
        value : lastColumnData.abstentions.rapportInscrit,
        color : "ABS",
        tooltip : "Abstentions : " + String(Math.round(lastColumnData.abstentions.rapportInscrit * 10) / 10) + "%"
    });

    return firstSeven;
};

var computeChartDataAs = function (data, as) {
    var ret = [];

    // First seven
    var i;
    for (i = 0; i < 7; ++i) {
        if (as[i].color == null) { break; }
        ret.push({
            color : as[i].color,
            value : data[as[i].color].rapportExprime,
            label : as[i].label
        });
    }

    // Stacked column
    var otherSummedValue = 0;
    var j = i;
    while (as[i].color != null) {
        otherSummedValue += data[as[i].color].rapportExprime;
        ++i;
    }
    i = j;
    while (as[i].color != null) {
        ret.push({
            color : as[i].color,
            value : otherSummedValue,
            label : as[i].label,
            tooltip : getLabelFromNuance(as[i].color) + ' : ' + (Math.round(data[as[i].color].rapportExprime * 10) / 10) + "%"
        });
        otherSummedValue -= data[as[i].color].rapportExprime;
        ++i;
    }

    // Add a empty column
    ret.push({ value : 0 , label : "" });
    // Add the Abs + Blancs + Nuls column
    ret.push({
        label : "ABS",
        value : data.nuls.rapportInscrit + data.blancs.rapportInscrit + data.abstentions.rapportInscrit,
        tooltip : "Blancs et nuls : " + String(Math.round((data.nuls.rapportInscrit + data.blancs.rapportInscrit) * 10) / 10) + "%",
        color : "BLANCSNULS"
    });
    ret.push({
        label : "ABS",
        value : data.abstentions.rapportInscrit,
        color : "ABS",
        tooltip : "Abstentions : " + String(Math.round(data.abstentions.rapportInscrit * 10) / 10) + "%"
    });

    return ret;
};

var getPref = (function() {
    var mapping = {
        "01"    : { name : "Bourg-en-Bresse", coord : [46.205167, 5.225501] },
        "02"    : { name : "Laon", coord : [49.564133, 3.61989] },
        "03"    : { name : "Moulins", coord : [46.568059, 3.334417] },
        "04"    : { name : "Digne-les-Bains", coord : [44.092193, 6.235976] },
        "05"    : { name : "Gap", coord : [44.559638, 6.079758] },
        "06"    : { name : "Nice", coord : [43.710173, 7.261953] },
        "07"    : { name : "Privas", coord : [44.735269, 4.599039] },
        "08"    : { name : "Charleville-Mézières", coord : [49.762085, 4.726096] },
        "09"    : { name : "Foix", coord : [42.964127, 1.605232] },
        "10"    : { name : "Troyes", coord : [48.297345, 4.074401] },
        "11"    : { name : "Carcassonne", coord : [43.212161, 2.353663] },
        "12"    : { name : "Rodez", coord : [44.349389, 2.575986] },
        "13"    : { name : "Marseille", coord : [43.296482, 5.36978] },
        "14"    : { name : "Caen", coord : [49.182863, -0.370679] },
        "15"    : { name : "Aurillac", coord : [44.930953, 2.444997] },
        "16"    : { name : "Angoulême", coord : [45.648377, 0.156237] },
        "17"    : { name : "La Rochelle", coord : [46.160329, -1.151139] },
        "18"    : { name : "Bourges", coord : [47.081012, 2.398782] },
        "19"    : { name : "Tulle", coord : [45.26565, 1.771697] },
        "21"    : { name : "Dijon", coord : [47.322047, 5.04148] },
        "22"    : { name : "Saint-Brieuc", coord : [48.51418, -2.765835] },
        "23"    : { name : "Guéret", coord : [46.169599, 1.871452] },
        "24"    : { name : "Périgueux", coord : [45.184029, 0.721115] },
        "25"    : { name : "Besançon", coord : [47.237829, 6.024054] },
        "26"    : { name : "Valence", coord : [44.933393, 4.89236] },
        "27"    : { name : "Évreux", coord : [49.027013, 1.151361] },
        "28"    : { name : "Chartres", coord : [48.443854, 1.489012] },
        "29"    : { name : "Quimper", coord : [47.997542, -4.097899] },
        "30"    : { name : "Nîmes", coord : [43.836699, 4.360054] },
        "31"    : { name : "Toulouse", coord : [43.604652, 1.444209] },
        "32"    : { name : "Auch", coord : [43.64638, 0.586709] },
        "33"    : { name : "Bordeaux", coord : [44.837789, -0.57918] },
        "34"    : { name : "Montpellier", coord : [43.610769, 3.876716] },
        "35"    : { name : "Rennes", coord : [48.117266, -1.677793] },
        "36"    : { name : "Châteauroux", coord : [46.811434, 1.686779] },
        "37"    : { name : "Tours", coord : [47.394144, 0.68484] },
        "38"    : { name : "Grenoble", coord : [45.188529, 5.724524] },
        "39"    : { name : "Lons-le-Saunier", coord : [46.671361, 5.550796] },
        "40"    : { name : "Mont-de-Marsan", coord : [43.893485, -0.499782] },
        "41"    : { name : "Blois", coord : [47.586092, 1.335947] },
        "42"    : { name : "Saint-Étienne", coord : [45.439695, 4.387178] },
        "43"    : { name : "Le Puy-en-Velay", coord : [45.042768, 3.882936] },
        "44"    : { name : "Nantes", coord : [47.218371, -1.553621] },
        "45"    : { name : "Orléans", coord : [47.902964, 1.909251] },
        "46"    : { name : "Cahors", coord : [44.447523, 1.441989] },
        "47"    : { name : "Agen", coord : [44.203142, 0.616363] },
        "48"    : { name : "Mende", coord : [44.517611, 3.501873] },
        "49"    : { name : "Angers", coord : [47.478419, -0.563166] },
        "50"    : { name : "Saint-Lô", coord : [49.115469, -1.082814] },
        "51"    : { name : "Châlons-en-Champagne", coord : [48.956682, 4.363073] },
        "52"    : { name : "Chaumont", coord : [48.113748, 5.139256] },
        "53"    : { name : "Laval", coord : [48.078515, -0.766991] },
        "54"    : { name : "Nancy", coord : [48.692054, 6.184417] },
        "55"    : { name : "Bar-le-Duc", coord : [48.773605, 5.158238] },
        "56"    : { name : "Vannes", coord : [47.658236, -2.760847] },
        "57"    : { name : "Metz", coord : [49.119309, 6.175716] },
        "58"    : { name : "Nevers", coord : [46.990896, 3.162845] },
        "59"    : { name : "Lille", coord : [50.62925, 3.057256] },
        "60"    : { name : "Beauvais", coord : [49.429539, 2.080712] },
        "61"    : { name : "Alençon", coord : [48.432856, 0.091266] },
        "62"    : { name : "Arras", coord : [50.291002, 2.777535] },
        "63"    : { name : "Clermont-Ferrand", coord : [45.777222, 3.087025] },
        "64"    : { name : "Pau", coord : [43.2951, -0.370797] },
        "65"    : { name : "Tarbes", coord : [43.232951, 0.078082] },
        "66"    : { name : "Perpignan", coord : [42.688659, 2.894833] },
        "67"    : { name : "Strasbourg", coord : [48.573405, 7.752111] },
        "68"    : { name : "Colmar", coord : [48.079359, 7.358512] },
        "69"    : { name : "Lyon", coord : [45.764043, 4.835659] },
        "70"    : { name : "Vesoul", coord : [47.619788, 6.15428] },
        "71"    : { name : "Mâcon", coord : [46.306884, 4.828731] },
        "72"    : { name : "Le Mans", coord : [48.00611, 0.199556] },
        "73"    : { name : "Chambéry", coord : [45.564601, 5.917781] },
        "74"    : { name : "Annecy", coord : [45.899247, 6.129384] },
        "75"    : { name : "Paris", coord : [48.856614, 2.352222] },
        "76"    : { name : "Rouen", coord : [49.443232, 1.099971] },
        "77"    : { name : "Melun", coord : [48.542105, 2.6554] },
        "78"    : { name : "Versailles", coord : [48.801408, 2.130122] },
        "79"    : { name : "Niort", coord : [46.323716, -0.464777] },
        "80"    : { name : "Amiens", coord : [49.894067, 2.295753] },
        "81"    : { name : "Albi", coord : [43.925085, 2.148641] },
        "82"    : { name : "Montauban", coord : [44.022125, 1.35296] },
        "83"    : { name : "Toulon", coord : [43.124228, 5.928] },
        "84"    : { name : "Avignon", coord : [43.949317, 4.805528] },
        "85"    : { name : "La Roche-sur-Yon", coord : [46.670511, -1.426442] },
        "86"    : { name : "Poitiers", coord : [46.580224, 0.340375] },
        "87"    : { name : "Limoges", coord : [45.833619, 1.261105] },
        "88"    : { name : "Épinal", coord : [48.172402, 6.449403] },
        "89"    : { name : "Auxerre", coord : [47.798202, 3.573781] },
        "90"    : { name : "Belfort", coord : [47.639674, 6.863849] },
        "91"    : { name : "Évry", coord : [48.629828, 2.441782] },
        "92"    : { name : "Nanterre", coord : [48.892423, 2.215331] },
        "93"    : { name : "Bobigny", coord : [48.908612, 2.439712] },
        "94"    : { name : "Créteil", coord : [48.790367, 2.455572] },
        "95"    : { name : "Cergy", coord : [49.035617, 2.060325] },
        "971"   : { name : "Basse-Terre", coord : [17.302606, -62.717692] },
        "972"   : { name : "Fort-de-France", coord : [14.616065, -61.05878] },
        "973"   : { name : "Cayenne", coord : [4.9227, -52.3269] },
        "974"   : { name : "Saint-Denis", coord : [-20.882057, 55.450675] },
        "976"   : { name : "Mamoudzou", coord : [-12.7806, 45.2278] },
        "2A"    : { name : "Ajaccio", coord : [41.919229, 8.738635] },
        "2B"    : { name : "Bastia", coord : [42.697283, 9.450881] }
    };

    return function(dpt) {
        return mapping[dpt];
    }
})();