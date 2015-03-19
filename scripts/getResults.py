#!/usr/bin/env python3

import sys
import os
import json

import requests
from bs4 import BeautifulSoup

BASE_URL = "http://elections.interieur.gouv.fr/telechargements/DP2015/"
OUT_DIR = "../src/assets/json/results/"

def parseFloat(s):
    return float(s.replace(',', '.'))

def mkdir(path):
    if not os.path.isdir(path):
        os.mkdir(path)

def getDptsToUpdate(t):
    toUpdate = []
    dpts = []

    r = requests.get(BASE_URL + 'resultatsT{0}/index.xml'.format(t))
    soup = BeautifulSoup(r.text, "xml")

    if soup.Election is None:
        return (toUpdate, dpts)

    for dpt in soup.Election.Departements.findAll("Departement"):
        mustUpdate = False
        codDpt3Car = dpt.CodDpt3Car.string
        lastUpdateDateTime = "{0} {1}".format(dpt.DateDerPubDpt.string, dpt.HeureDerPubDpt.string)

        dpts.append((codDpt3Car, dpt.CodMinDpt.string))

        if dpt.Clos.string == "CLOS":
            mustUpdate = True
            jsonFileName = os.path.join(OUT_DIR, "T{0}".format(t), "{0}.json".format(codDpt3Car))
            if os.path.isfile(jsonFileName):
                with open(jsonFileName) as f:
                    try:
                        if lastUpdateDateTime == json.loads(f.read())['lastUpdateDateTime']:
                            mustUpdate = False
                    except ValueError:
                        pass

        if mustUpdate:
            toUpdate.append((codDpt3Car, lastUpdateDateTime))

    return (toUpdate, dpts)

def getFEResults(t, fName = None):
    if fName is None:
        fName = "FE"

    print("Retrieving results for {0}".format(fName))

    results = {
        "inscrits" : None, "abstentions" : None, "nuls" : None,
        "blancs" : None, "votants" : None, "exprimes" : None
    }

    r = requests.get(BASE_URL + 'resultatsT{0}/{1}.xml'.format(t, fName))
    soup = BeautifulSoup(r.text, "xml")

    # No data yet
    if soup.Tours is None:
        print("Results not available (yet).")
        return None

    try:
        tour = soup.Tours.findAll("Tour")[t - 1]

        results["inscrits"] = int(tour.Mentions.Inscrits.Nombre.string)
        for k in ["Abstentions", "Votants"]:
            results[k.lower()] = dict(
                nombre=int(getattr(tour.Mentions, k).Nombre.string),
                rapportInscrit=parseFloat(getattr(tour.Mentions, k).RapportInscrit.string)
            )
        for k in ["Nuls", "Blancs", "Exprimes"]:
            results[k.lower()] = dict(
                nombre=int(getattr(tour.Mentions, k).Nombre.string),
                rapportInscrit=parseFloat(getattr(tour.Mentions, k).RapportInscrit.string),
                rapportVotant=parseFloat(getattr(tour.Mentions, k).RapportVotant.string)
            )

        if tour.Resultats.NuancesBin != None:
            for nuance in tour.Resultats.NuancesBin.findAll("NuanceBin"):
                results[nuance.CodNuaBin.string] = dict(
                    nombre=int(nuance.NbVoix.string),
                    rapportInscrit=parseFloat(nuance.RapportInscrit.string),
                    rapportExprime=parseFloat(nuance.RapportExprime.string)
                )
        else:
            for binome in tour.Resultats.Binomes.findAll("Binome"):
                results[binome.CodNuaBin.string] = dict(
                    nombre=int(binome.NbVoix.string),
                    rapportInscrit=parseFloat(binome.RapportInscrit.string),
                    rapportExprime=parseFloat(binome.RapportExprime.string),
                    nom=binome.LibBin.string
                )
    except:
        pass
    return results

def getDptResults(t, dptCod3Car, lastUpdateDateTime):
    return dict(
        results=getFEResults(t, "{0}/{0}".format(dptCod3Car)),
        lastUpdateDateTime=lastUpdateDateTime
    )

def getCanResults(t, dptCod3Car, codCan):
    return getFEResults(t, "{0}/{0}{1}".format(dptCod3Car, codCan))

def getCanList(t, dptCod3Car):
    ret = []

    r = requests.get(BASE_URL + 'resultatsT{0}/{1}/T{0}{1}.xml'.format(t, dptCod3Car))
    soup = BeautifulSoup(r.text, "xml")

    for can in soup.Election.Departement.Cantons.findAll('Canton'):
        ret.append(can.CodCan.string)

    return ret

def getTop(data):
    return sorted([(k, v['rapportExprime']) for k, v in data.items() if k[:2] == "BC"], key=lambda x: x[1], reverse=True)[0]

def computeFranceMapData(t, dpts):
    dptsMapData = dict()

    for (dptCod3Car, dptCodMin) in allDpts:
        jsonFileName = os.path.join(OUT_DIR, 'T{0}'.format(t), "{0}.json".format(dptCod3Car))
        if (os.path.isfile(jsonFileName)):
            with open(jsonFileName, "r") as f:
                try:
                    dptData = json.loads(f.read())['results']
                    dptsMapData[dptCodMin] = getTop(dptData)
                except ValueError:
                    pass
        else:
            dptsMapData[dptCodMin] = None

    return dptsMapData

def computeDptMapData(t, dptCod3Car, canList):
    mapData = dict()

    for codCan in canList:
        jsonFileName = os.path.join(OUT_DIR, 'T{0}'.format(t), dptCod3Car, "{0}.json".format(codCan))
        if (os.path.isfile(jsonFileName)):
            with open(jsonFileName, 'r') as f:
                try:
                    canData = json.loads(f.read())
                    mapData[codCan] = getTop(canData)
                except ValueError:
                    pass
        else:
            mapData[codCan] = None

    return mapData

if __name__ == "__main__":
    t = 1

    argv = sys.argv

    for (i, arg) in enumerate(argv):
        if arg[:7] == "--dest=":
            OUT_DIR = arg.split('=')[1]
            argv = argv[:i] + argv[i+1:]
            break

    if len(argv) > 1:
        t = int(argv[1])

    # Bootstrap output dir
    mkdir(OUT_DIR)
    mkdir(os.path.join(OUT_DIR, 'T{0}'.format(t)))

    # Retrieve global France results
    FEResults = getFEResults(t)
    if FEResults != None:
        with open(os.path.join(OUT_DIR, 'T{0}'.format(t), 'FE.json'), "w") as f:
            f.write(json.dumps(FEResults))

    # Retrieve global Dpt results
    (toUpdate, allDpts) = getDptsToUpdate(t)
    dptsData = dict()
    for (dptCod3Car, lastUpdateDateTime) in toUpdate:

        with open(os.path.join(OUT_DIR, 'T{0}'.format(t), "{0}.json".format(dptCod3Car)), "w") as f:
            f.write(json.dumps(getDptResults(t, dptCod3Car, lastUpdateDateTime)))

        # Retrieve Can results
        outFolder = os.path.join(OUT_DIR, 'T{0}'.format(t), dptCod3Car)
        mkdir(outFolder)

        canList = getCanList(t, dptCod3Car)

        for codCan in canList:
            with open(os.path.join(outFolder, "{0}.json".format(codCan)), 'w') as f:
                f.write(json.dumps(getCanResults(t, dptCod3Car, codCan)))

        # Compute data for Dpt map
        with open(os.path.join(outFolder, "MAP.json"), "w") as f:
            f.write(json.dumps(computeDptMapData(t, dptCod3Car, canList)))

    # Compute data for France map
    franceMapData = computeFranceMapData(t, allDpts)
    if len(franceMapData.keys()) > 0:
        with open(os.path.join(OUT_DIR, 'T{0}'.format(t), "FEMAP.json"), "w") as f:
            f.write(json.dumps(franceMapData))

    if FEResults == None:
        # We must compute partial FE results based on our .json files
        computedResults = {}
        resultsDir = os.path.join(OUT_DIR, 'T{0}'.format(t))
        if len(os.listdir(resultsDir)) > 0:
            for f in os.listdir(resultsDir):
                filePath = os.path.join(resultsDir, f)
                if f[:2] != 'FE' and os.path.isfile(filePath):
                    with open(filePath, 'r') as jsonFile:
                        results = json.loads(jsonFile.read())['results']
                        for key in results:
                            if key == "inscrits":
                                results[key] = dict(nombre=results[key])
                            if key not in computedResults:
                                computedResults[key] = dict(
                                    nombre=results[key]["nombre"],
                                )
                            else:
                                computedResults[key]["nombre"] += results[key]["nombre"]
            for key in computedResults:
                if key[:2] == 'BC':
                    computedResults[key]['rapportExprime'] = computedResults[key]['nombre'] * 100 / computedResults['exprimes']['nombre']
            computedResults['abstentions']['rapportInscrit'] = computedResults['abstentions']['nombre'] * 100 / computedResults['inscrits']['nombre']
            computedResults['nuls']['rapportInscrit'] = computedResults['nuls']['nombre'] * 100 / computedResults['inscrits']['nombre']
            computedResults['blancs']['rapportInscrit'] = computedResults['blancs']['nombre'] * 100 / computedResults['inscrits']['nombre']
            with open(os.path.join(OUT_DIR, 'T{0}'.format(t), 'FE.json'), "w") as fFE:
                fFE.write(json.dumps(computedResults))