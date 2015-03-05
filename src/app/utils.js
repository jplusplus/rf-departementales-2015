var getLabelFromNuance = (function() {
    var mapping = {
        "BC-EXG" :  "Extrême gauche",
        "BC-FG" :   "Front de Gauche",
        "BC-PG" :   "Parti de Gauche",
        "BC-COM" :  "Parti communiste français",
        "BC-SOC" :  "Parti socialiste",
        "BC-UG" :   "Union de la Gauche",
        "BC-RDG" :  "Parti radical de gauche",
        "BC-DVG" :  "Divers gauche",
        "BC-VEC" :  "Europe-Ecologie-Les Verts",
        "BC-DIV" :  "Divers",
        "BC-MDM" :  "Modem",
        "BC-UC" :   "Union du Centre",
        "BC-UDI" :  "Union Démocrates et indépendants",
        "BC-UMP" :  "Union pour un Mouvement populaire",
        "BC-UD" :   "Union de la Droite",
        "BC-DLF" :  "Debout la France",
        "BC-DVD" :  "Divers droite",
        "BC-FN" :   "Front National",
        "BC-EXD" :  "Extrême droite"
    };

    return function(nuance) {
        return mapping[nuance];
    };
})();