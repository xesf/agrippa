#!/usr/bin/env python
import sys



SOI = '\xFF\xD8'
APP0MARKER = '\xFF\xE0'
IDENTIFIER = 'JFIF\x00'
EOI = '\xFF\xD9'

def save_image(data, filename, number):
    if len(data) > 0:
        with open("{}-{}.jpg".format(destname, number), 'wb') as fp:
            fp.write(data)

if __name__ == "__main__":

    if len(sys.argv) < 3:
        print("usage: ./pff.py [filename] [destname]")
        sys.exit(0)

    filename = sys.argv[1]
    destname = sys.argv[2]

    with open(filename) as fp:
        data = fp.read()

    # FIXME: let's do it the dumb way first
    soi = data.find(SOI)
    eoi = data.find(EOI)
    i = 0

    while(soi != -1 and eoi != -1):


        image = data[soi:eoi+len(EOI)]
        data = data[eoi+len(EOI):]

        save_image(image, destname, i)

        i += 1
        if i > 2000:
            sys.exit(0)

        soi = data.find(SOI)
        eoi = data.find(EOI)
