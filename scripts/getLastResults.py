#!/usr/bin/env python3

import sys
import os
import json

import requests
from bs4 import BeautifulSoup

BASE_URL = "http://elections.interieur.gouv.fr/telechargements/DP2015/resultatsT2/"
OUT_DIR = "../src/assets/json/results/"

def mkdir(path):
    if not os.path.isdir(path):
        os.mkdir(path)

def get_all_dpts():
    ret = list()
    r = requests.get(BASE_URL + 'index.xml')
    soup = BeautifulSoup(r.text, "xml")

    for dpt in soup.Election.Departements.find_all('Departement'):
        ret.append((dpt.CodDpt3Car.string, dpt.CodMinDpt.string))

    return ret

if __name__ == "__main__":
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
    OUT_DIR = os.path.join(OUT_DIR, 'T3')
    mkdir(OUT_DIR)

    femap_data = dict()
    for dpt in get_all_dpts():
        r = requests.get(BASE_URL + '{0}/{0}.xml'.format(dpt[0]))
        soup = BeautifulSoup(r.text, "xml")
        sieges = dict()
        for tour in soup.Election.Tours.find_all('Tour'):
            for nuance in tour.Resultats.NuancesBin.find_all('NuanceBin'):
                if nuance.CodNuaBin.string not in sieges:
                    sieges[nuance.CodNuaBin.string] = 0
                sieges[nuance.CodNuaBin.string] += int(nuance.NbElus.string)
        _max = sorted([v for k, v in sieges.items()], key=lambda v: v, reverse=True)[0]
        femap_data[dpt[1]] = [(k, v) for k, v in sieges.items() if v == _max]
    with open(os.path.join(OUT_DIR, 'FEMAP.json'), 'w') as f:
        f.write(json.dumps(femap_data))