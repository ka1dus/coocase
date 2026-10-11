/** Company contact details from the 2026–2027 catalogue. */
export const company = {
  emails: ["fredafeng@coocase.com.cn", "vincent@coocase.com.cn"],
  phone: "+86 750 360 9178",
  website: "https://www.coocase.com",
  founded: 2006,
  countries: 38,
  social: {
    facebook: "https://facebook.com/coocase",
    instagram: "https://instagram.com/coocase",
    youtube: "https://youtube.com/@coocase",
  },
  offices: [
    { key: "singapore", address: "590 Serangoon Road, Singapore 218204", email: "fredafeng@coocase.com.cn" },
    { key: "europe", address: "38 Marathonos str., GR 104 36 Athens, Greece" },
    {
      key: "china",
      address: "No.25, Ji Ya Yin, Dongsheng Village, Jianghai 4th Rd., Jianghai District, Jiangmen City, Guangdong 529000, China",
      phone: "+86 750 360 9178",
      email: "fredafeng@coocase.com.cn",
    },
  ] as const,
};
