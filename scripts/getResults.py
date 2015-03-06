#!/usr/bin/env python3

import sys
import os
import json

import requests
from bs4 import BeautifulSoup

BASE_URL = "http://www.interieur.gouv.fr/avotreservice/elections/telechargements/EssaiDP2015/"
OUT_DIR = "/home/paulloz/gits/departementales-2015/src/assets/json/results/"

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

        for nuance in tour.Resultats.NuancesBin.findAll("NuanceBin"):
            results[nuance.CodNuaBin.string] = dict(
                nombre=int(nuance.NbVoix.string),
                rapportInscrit=parseFloat(nuance.RapportInscrit.string),
                rapportExprime=parseFloat(nuance.RapportExprime.string)
            )

    except IndexError as e:
        pass
    return results

def getDptResults(t, dptCod3Car, lastUpdateDateTime):
    return dict(
        results=getFEResults(t, "{0}/{0}".format(dptCod3Car)),
        lastUpdateDateTime=lastUpdateDateTime
    )

def computeFranceMapData(t, dpts):
    dptsMapData = dict()

    for (dptCod3Car, dptCodMin) in allDpts:
        jsonFileName = os.path.join(OUT_DIR, 'T{0}'.format(t), "{0}.json".format(dptCod3Car))
        if (os.path.isfile(jsonFileName)):
            with open(jsonFileName, "r") as f:
                try:
                    dptData = json.loads(f.read())['results']
                    dptsMapData[dptCodMin] = sorted([(k, v['rapportExprime']) for k, v in dptData.items() if k[:2] == "BC"], key=lambda x: x[1], reverse=True)[0]
                except ValueError:
                    pass
        else:
            dptsMapData[dptCodMin] = None

    return dptsMapData

if __name__ == "__main__":
    t = 1
    if len(sys.argv) > 1:
        t = sys.argv[1]

    # Bootstrap output dir
    mkdir(OUT_DIR)
    mkdir(os.path.join(OUT_DIR, 'T1'))

    # Retrieve global France results
    # with open(os.path.join(OUT_DIR, 'T{0}'.format(t), 'FE.json'), "w") as f:
    #     f.write(json.dumps(getFEResults(t)))

    # Retrieve global Dpt results
    (toUpdate, allDpts) = getDptsToUpdate(t)
    dptsData = dict()
    for (dptCod3Car, lastUpdateDateTime) in toUpdate:
        with open(os.path.join(OUT_DIR, 'T{0}'.format(t), "{0}.json".format(dptCod3Car)), "w") as f:
            f.write(json.dumps(getDptResults(t, dptCod3Car, lastUpdateDateTime)))
    # Compute data for France map
    with open(os.path.join(OUT_DIR, 'T{0}'.format(t), "FEMAP.json"), "w") as f:
        f.write(json.dumps(computeFranceMapData(t, allDpts)))