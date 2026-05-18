export const getRegion = () => {
  const locale = navigator.language.toLowerCase();

  console.log("USER LOCALE:", locale);

  // INDIA
  if (
    locale.includes("en-in") ||
    locale.includes("hi")
  ) {
    return "INDIA";
  }

  // GCC
  if (
    locale.includes("ar") ||
    locale.includes("en-ae") ||
    locale.includes("en-sa") ||
    locale.includes("en-qa") ||
    locale.includes("en-kw") ||
    locale.includes("en-om") ||
    locale.includes("en-bh")
  ) {
    return "GCC";
  }

  // AFRICA
  if (
    locale.includes("en-ng") ||
    locale.includes("en-za") ||
    locale.includes("en-ke") ||
    locale.includes("en-gh")
  ) {
    return "AFRICA";
  }

  // DEFAULT
  return "GLOBAL";
};