export const download = (url: string | Blob, filename = "download") => {
  const link = document.createElement("a");

  if (url instanceof Blob) {
    link.href = URL.createObjectURL(url);
  } else {
    link.href = url;
  }

  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (url instanceof Blob) {
    URL.revokeObjectURL(link.href);
  }
};
