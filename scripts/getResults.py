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

def getFEResults(t):
    results = {
        "inscrits" : None, "abstentions" : None, "nuls" : None,
        "blancs" : None, "votants" : None, "exprimes" : None
    }

    r = requests.get(BASE_URL + 'resultatsT{0}/FE.xml'.format(t))
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

if __name__ == "__main__":
    t = 1
    if len(sys.argv) > 1:
        t = sys.argv[1]

    # Bootstrap output dir
    mkdir(OUT_DIR)
    mkdir(os.path.join(OUT_DIR, 'T1'))

    # Retrieve global France results
    with open(os.path.join(OUT_DIR, 'T' + str(t), 'FE.json'), "w") as f:
        f.write(json.dumps(getFEResults(t)))