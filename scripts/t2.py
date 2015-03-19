#!/usr/bin/env python3

import os
import sys
import json

OUT_DIR = "../src/assets/json/results/"

if __name__ == "__main__":
    argv = sys.argv
    for (i, arg) in enumerate(argv):
        if arg[:7] == "--dest=":
            OUT_DIR = arg.split('=')[1]
            argv = argv[:i] + argv[i+1:]
            break

    OUT_DIR = os.path.join(OUT_DIR, "T2")

    for f in os.listdir(OUT_DIR):
        if "exists" in f:
            continue

        if os.path.isdir(os.path.join(OUT_DIR, f)):
            subdir = os.path.join(OUT_DIR, f)
            for fi in os.listdir(subdir):
                if "exists" in f or "MAP" in f:
                    continue
                fi = fi.split('.')
                with open(os.path.join(subdir, fi[0] + '_exists.json'), "w") as fil:
                    fil.write(json.dumps({}))
        elif f[:2] != "FE":
            f = f.split('.')
            with open(os.path.join(OUT_DIR, f[0] + '_exists.json'), "w") as fi:
                fi.write(json.dumps({}))