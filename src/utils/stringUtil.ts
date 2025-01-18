export function notEmpty(s) {
  return !(s == undefined || s === "");
}

export function isValidURL(url: string): boolean {
  const urlRegex = /^(https?:\/\/)?[^\s/$.?#].[^\s]*$/i;
  return urlRegex.test(url);
}
