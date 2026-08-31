#!/usr/bin/env python3
"""Render the student handout to a print-ready A4 PDF with page numbers.

No browser implements the CSS page margin-at-rules, so the HTML cannot number
its own pages; printed from a browser, the number comes from the print dialog.
This script uses a paged-CSS engine, which does implement them, to produce a PDF
that carries the numbers itself.

    pip install weasyprint
    python3 tools/build-pdf.py

Writes lab/bottle-jack-lab-handout-A4.pdf.
"""
import os
import sys

try:
    from weasyprint import HTML, CSS
except ImportError:
    sys.exit("weasyprint is required: pip install weasyprint")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "lab", "bottle-jack-lab-handout.html")
OUT = os.path.join(ROOT, "lab", "bottle-jack-lab-handout-A4.pdf")

# the only thing added at build time: the running page number
PAGE_NUMBERS = CSS(string="""
@page {
  @bottom-center {
    content: "Page " counter(page) " of " counter(pages);
    font-family: "Nimbus Roman", "Times New Roman", Times, serif;
    font-size: 9pt;
    color: #55606a;
  }
}
""")

HTML(filename=SRC).write_pdf(OUT, stylesheets=[PAGE_NUMBERS])
print("wrote", os.path.relpath(OUT, ROOT), "-", round(os.path.getsize(OUT)/1024), "kB")
