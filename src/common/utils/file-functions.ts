const convertBase64toBlob = (b64Data: string, contentType: string = "", sliceSize = 512): Blob => {
  const byteCharacters = atob(b64Data.split(",")[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const pdfShowFile = async (filePath: any, name: string) => {
  const blob = convertBase64toBlob(String(filePath), "application/pdf");
  const blobWithType = new Blob([blob], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blobWithType);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  const fileName = name;
  const fileUrl = new URL(url);
  fileUrl.pathname = `${fileName}.pdf`;
  window.open(fileUrl.toString(), "_blank");
  // Liberar el objeto URL cuando ya no sea necesario
  window.URL.revokeObjectURL(url);
};
