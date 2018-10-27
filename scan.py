#! /usr/local/bin/python

import os
import sys
import json
from glob import glob
from pydpkg import Dpkg as dpkg

# Writes the data to 'Packages' file
def write_packages(pkgs_info, outputDir):
    with open(outputDir + "Packages", 'w') as f:
        for package in pkgs_info:
            for field, value in package.items():
                f.write(field + ": " + value + "\n")
            f.write("\n")

# Writes dats to 'Packages.json' file
def write_json(pkgs_info, outputDir):
    with open(outputDir + "Packages.json", "w") as f:
        print("PP")
        json.dump(pkgs_info, f, indent=1)

# Gets all .deb files in 'debs' and grabs their control data
def scan(inputDir, outputDir):
    pkgs_info = []
    deb_paths = glob(inputDir + "/*.deb")
    for deb_path in deb_paths:
        package = dpkg(deb_path)
        pkg_info = package.headers
        pkg_info['SHA256'] = package.sha256
        pkg_info['SHA1'] = package.sha1
        pkg_info['MD5sum'] = package.md5
        pkg_info['Filename'] = package.filename
        pkg_info['Size'] = str(package.filesize)
        pkg_info['Depiction'] = "depic/?p=" + package["Package"]
        pkgs_info.append(pkg_info)

    write_json(pkgs_info, outputDir)
    write_packages(pkgs_info, outputDir)
    return pkgs_info

scan(sys.argv[1], sys.argv[2] + "/")
