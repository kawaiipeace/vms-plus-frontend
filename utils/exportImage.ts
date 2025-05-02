import { toPng } from "html-to-image";

/**
 * Exports a DOM element as a PNG image.
 * @param element The HTML element to export.
 * @param filename The filename to save as.
 * @param preExport Optional function to run before export (e.g., hide UI).
 * @param postExport Optional function to run after export (e.g., restore UI).
 */
export async function exportElementAsImage(
  element: HTMLElement | null,
  filename: string = "export-image.png",
  preExport?: () => void,
  postExport?: () => void
): Promise<void> {
  if (!element) {
    console.error("Element is null. Cannot export.");
    return;
  }

  try {
    preExport?.();

    // Add a slight delay to ensure rendering is complete
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Temporarily set styles for better rendering
    const originalOverflow = element.style.overflow;
    element.style.overflow = "visible";

    const dataUrl = await toPng(element, {
      cacheBust: true,
      width: element.scrollWidth,
      height: element.scrollHeight,
      pixelRatio: 3,
    });
    

    // Restore original styles
    element.style.overflow = originalOverflow;

    // Create a download link and trigger download
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Error exporting image:", error);
  } finally {
    postExport?.();
  }
}