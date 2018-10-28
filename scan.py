#! /usr/local/bin/python

import json
import gzip
import argparse
from glob import glob
from pydpkg import Dpkg as dpkg


# Writes the data to 'Packages' file
def write_packages(pkgs_info, outputDir):
    with open(outputDir + "/Packages", 'w') as f:
        for package in pkgs_info:
            for field, value in package.items():
                f.write(field + ": " + value + "\n")
            f.write("\n")

    # Gzips Packages
    with open(outputDir + "/Packages", 'r') as f:
        with gzip.open(outputDir + "/Packages.gz", "wb") as archive:
            archive.write(f.read().encode())


# Writes data to 'Packages.json' file
def write_json(pkgs_info, outputDir):
    with open(outputDir + "/Packages.json", "w") as f:
        json.dump(pkgs_info, f, indent=1)


# Scans deb at specified path
def scan_deb(deb_path):
    package = dpkg(deb_path)
    pkg_info = package.headers
    pkg_info['SHA256'] = package.sha256
    pkg_info['SHA1'] = package.sha1
    pkg_info['MD5sum'] = package.md5
    pkg_info['Filename'] = package.filename
    pkg_info['Size'] = str(package.filesize)
    pkg_info['Depiction'] = "depic/?p=" + package["Package"]
    return pkg_info


parser = argparse.ArgumentParser(description="Scans .deb files")
parser.add_argument("--dir")
parser.add_argument("--deb")
parser.add_argument("-o")
args = parser.parse_args()

# If a single deb specified
if args.deb and not args.dir:
    pkg_info = scan_deb(args.deb)

# If a dir of debs specified
elif args.dir:
    pkg_info = []
    for deb_path in glob(args.dir + "/*.deb"):
        pkg_info.append(scan_deb(deb_path))

# If output dir supplied
if args.o and not args.deb:
    write_packages(pkg_info, args.o)
    write_json(pkg_info, args.o)
else:
    print(pkg_info)
