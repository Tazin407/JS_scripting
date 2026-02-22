import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";

// handles both local files and urls
console.time("Fetch time");
async function getBuffer(source){
    if (source.startsWith("http://") || source.startsWith("https://") ){
        const response = await fetch(source);
        if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
        return response.arrayBuffer();
    }

    return await fs.readFile(source);
}
console.timeEnd("Fetch time");

console.time("Load time");
async function mergePDFs(pdfPath1, pdfPath2, outputPath) {
    const buffer1 = await getBuffer(pdfPath1);
    const buffer2 = await getBuffer(pdfPath2); // readFile() returns a Buffer(binary data) for load
    
    const pdf1 = await PDFDocument.load(buffer1); // parses that binary data into a PDFDocument object
    const pdf2 = await PDFDocument.load(buffer2);

    const mergedPdf = await PDFDocument.create();

    // Copy pages from the first PDF
    const copiedPages1 = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
    copiedPages1.forEach((page) => {
        mergedPdf.addPage(page);
    });

    // Copy pages from the second PDF
    const copiedPages2 = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
    copiedPages2.forEach((page) => {
        mergedPdf.addPage(page);
    });

    // Save the merged PDF to a file
    const finalPdf = await mergedPdf.save();
    await fs.writeFile(outputPath, finalPdf);
    
}
console.timeEnd("Load time");

console.time("Execution time")
mergePDFs("https://icseindia.org/document/sample.pdf", "https://ontheline.trincoll.edu/images/bookdown/sample-local-pdf.pdf", "./merged.pdf");
console.timeEnd("Execution time")
