// Company facts reuse the published figures already held in content/site.ts.
export const reachContent = {
  title: "Who we are",
  description:
    "170+ curious minds. One shared purpose: transforming human experiences through intelligence, innovation and technology.",
  statement:
    "We connect people, platforms and possibilities. Across industries. Across the world.",
};
export const reachLocations = [
  {
    name: "Dubai",
    country: "United Arab Emirates",
    latitude: 25.2,
    longitude: 55.3,
  },
  { name: "Hyderabad", country: "India", latitude: 17.4, longitude: 78.5 },
  { name: "Riyadh", country: "Saudi Arabia", latitude: 24.7, longitude: 46.7 },
  { name: "Tanuku", country: "India", latitude: 16.8, longitude: 81.7 },
  { name: "Vancouver", country: "Canada", latitude: 49.3, longitude: -123.1 },
];

// Exact map destinations published in the live website’s shared footer.
export const officeMapLinks: Record<string, string> = {
  Dubai:
    "https://www.google.co.in/maps/place/Vectramind+Corporation/@25.1353254,55.376094,13.5z/data=!4m5!3m4!1s0x0:0x20506e1077440bac!8m2!3d25.1326437!4d55.3854758",
  Hyderabad:
    "https://www.google.co.in/maps/place/Vectramind+Technologies+Pvt+Ltd/@17.4563007,78.3752015,18z/data=!4m13!1m7!3m6!1s0x3bcb93da7fc67875:0xf4a98a93e3b2e79a!2sVectramind+Technologies+Pvt+Ltd!3b1!8m2!3d17.4563924!4d78.3758479!3m4!1s0x3bcb93da7fc67875:0xf4a98a93e3b2e79a!8m2!3d17.4563924!4d78.3758479?hl=en",
  Riyadh:
    "https://www.google.com/maps?q=AstroLabs,+3141+Anas+Ibn+Malik+Rd,+Al+Malqa,+Riyadh+13521,+Saudi+Arabia&ftid=0x3e2ee5973ff30251:0xe165035711dcf14f&entry=gps&lucs=,94242544,94224825,94227247,94227248,47071704,47069508,94218641,94203019,47084304,94208458,94208447&g_ep=CAISDTYuMTM2LjAuODc4MzAYACDXggMqYyw5NDI0MjU0NCw5NDIyNDgyNSw5NDIyNzI0Nyw5NDIyNzI0OCw0NzA3MTcwNCw0NzA2OTUwOCw5NDIxODY0MSw5NDIwMzAxOSw0NzA4NDMwNCw5NDIwODQ1OCw5NDIwODQ0N0ICQUU%3D&g_st=com.google.maps.preview.copy",
  Tanuku:
    "https://www.google.co.in/maps/place/Vectramind+Technologies+pvt+ltd/@16.757032,81.6684661,15z/data=!4m5!3m4!1s0x0:0x7e5f14fd5cb10b70!8m2!3d16.7585075!4d81.667707",
  Vancouver: "https://goo.gl/maps/RCpA21PmM5mSrSTp8",
};
