import fs from "fs";
import PDFDocument from "pdfkit";
import mammoth from "mammoth";

export const txtToPdf = async (txtPath: string): Promise<string> => {
  const content = fs.readFileSync(txtPath, "utf-8");
  const outputPath = txtPath.replace(/\.txt$/i, ".pdf");

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);
  doc.text(content);
  doc.end();

  return new Promise((resolve) => {
    stream.on("finish", () => resolve(outputPath));
  });
};

export const docxToPdf = async (docxPath: string): Promise<string> => {
  const outputPath = docxPath.replace(/\.docx$/i, ".pdf");

  const { value: text } = await mammoth.extractRawText({ path: docxPath });

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);
  doc.text(text);
  doc.end();

  return new Promise((resolve) => {
    stream.on("finish", () => resolve(outputPath));
  });
};
