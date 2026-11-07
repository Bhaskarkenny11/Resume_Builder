import * as pdfjsLib from 'pdfjs-dist';

// Configure local same-origin worker to eliminate cross-origin and network CDN failures
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  let fullText = '';

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items with line breaks based on Y positions or newlines
    let lastY: number | null = null;
    let pageText = '';

    for (const item of textContent.items as any[]) {
      if (!item.str) continue;
      const currentY = item.transform ? item.transform[5] : null;

      if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
        pageText += '\n';
      } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
        pageText += ' ';
      }
      pageText += item.str;
      lastY = currentY;
    }

    fullText += pageText + '\n\n';
  }

  return fullText.trim();
}
