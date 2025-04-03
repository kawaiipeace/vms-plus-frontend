export function shortenFilename(file: string): string {
    if(file == "") return file;
    const fileNameWithExt = file ? file.split("/").pop() || "" : "";
    const fileParts = fileNameWithExt.split(".");
    const extension = fileParts.length > 1 ? "." + fileParts.pop() : "";
    const baseFileName = fileParts.join(".");
    const truncatedName = baseFileName.length > 10 ? baseFileName.slice(0, 10) + "..." : baseFileName;
    const displayFileName = truncatedName + extension;
    return displayFileName;
  }
  