export interface WeddingEvent {
  id: string;
  title: string;
  day: string;
  date: string;
  fullDate: string; // ISO or formatted date
  time: string;
  venue: string;
  description: string;
  iconName: string;
  accentColor: string;
}

export interface RSVPContact {
  name: string;
  phone: string;
  relation?: string;
  displayPhone: string;
}

export interface GuestBlessing {
  id: string;
  name: string;
  relation: string;
  message: string;
  timestamp: number;
  likes: number;
}

export const WEDDING_DETAILS = {
  bride: "Ishita",
  groom: "Aarnav",
  weddingDate: "2026-11-25T18:00:00+05:30",
  mainDateDisplay: "25th November 2026",
  mainDayDisplay: "Wednesday",
  hosts: "Smt. Mamta Rani & Sh. Sunil Khokhar",
  residence: "WZ-3944A, Sri Nagar, Shakur Basti, Delhi-110034",
  brideLineage: "Grand D/o Late Smt. Jai Devi & Late Sh. Raghubir Singh Khokhar\nDaughter of Smt. Mamta Rani & Sh. Sunil Khokhar",
  groomLineage: "Son of Smt. Rachna Gupta & Sh. Anil Gupta",
  venue: {
    name: "ANTILIA BY ZION",
    address: "NH-44, Ambala, Delhi Road, Bahalgarh, Joshi Chohan, Sonipat, Haryana-131021",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Antilia+By+Zion+Sonipat+NH-44+Haryana",
  },
  nephewNote: {
    salutation: "Kia Ora Everyone !",
    highlight: "It’s my Maasi Ishita’s Wedding !",
    invitation: "Come along and celebrate with us !",
    cheer: "We’ll have heaps of fun, dancing & yummy food !",
    signature: "Love from Drishyey",
  },
  rsvpContacts: [
    { name: "Sunil Khokhar", phone: "9818560884", displayPhone: "9818560884", relation: "Father" },
    { name: "Mamta Rani", phone: "9868157686", displayPhone: "9868157686", relation: "Mother" },
    { name: "Varun Khokhar", phone: "9773713944", displayPhone: "9773713944", relation: "Brother" },
  ] as RSVPContact[],
  warmlyInvitedBy: "Khokhar Family & All Nears & Dears",
  shlokas: {
    ganeshShort: "॥ ॐ श्री गणेशाय नमः ॥",
    vakratunda: "वक्रतुण्ड महाकाय, सूर्यकोटि समप्रभः।\nनिर्विघ्नं कुरु मे देव, सर्वकार्येषु सर्वदा ॥",
    vakratundaSingle: "॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभः। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥"
  }
};

export const CELEBRATION_SCHEDULE: WeddingEvent[] = [
  {
    id: "mehendi",
    title: "Mehendi Ceremony",
    day: "Monday",
    date: "23rd November 2026",
    fullDate: "2026-11-23T16:00:00+05:30",
    time: "4:00 PM Onwards",
    venue: "Antilia By Zion, Sonipat",
    description: "An afternoon of vibrant henna patterns, melodious folk songs, and celebratory festive dances.",
    iconName: "Sparkles",
    accentColor: "from-emerald-700 to-teal-900"
  },
  {
    id: "lagan-tika",
    title: "Lagan Tika",
    day: "Tuesday",
    date: "24th November 2026",
    fullDate: "2026-11-24T11:00:00+05:30",
    time: "11:00 AM",
    venue: "Antilia By Zion, Sonipat",
    description: "Sacred auspicious rituals marking formal wedding acceptance with elders' divine blessings.",
    iconName: "Scroll",
    accentColor: "from-amber-600 to-yellow-800"
  },
  {
    id: "ring-ceremony",
    title: "God Bharai / Ring Ceremony",
    day: "Tuesday",
    date: "24th November 2026",
    fullDate: "2026-11-24T12:00:00+05:30",
    time: "12:00 Noon",
    venue: "Antilia By Zion, Sonipat",
    description: "Exchange of engagement rings and traditional God Bharai blessings showered upon the couple.",
    iconName: "Heart",
    accentColor: "from-rose-600 to-red-800"
  },
  {
    id: "cocktail",
    title: "Cocktail Evening",
    day: "Tuesday",
    date: "24th November 2026",
    fullDate: "2026-11-24T19:00:00+05:30",
    time: "7:00 PM",
    venue: "Antilia By Zion, Sonipat",
    description: "A dazzling evening of music, gourmet feast, toasts, and dance celebration with family & friends.",
    iconName: "Wine",
    accentColor: "from-purple-800 to-indigo-950"
  },
  {
    id: "haldi",
    title: "Haldi Utsav",
    day: "Wednesday",
    date: "25th November 2026",
    fullDate: "2026-11-25T10:00:00+05:30",
    time: "10:00 AM",
    venue: "Antilia By Zion, Sonipat",
    description: "Auspicious turmeric cleansing ritual filled with marigold flower showers, joy, and laughter.",
    iconName: "Sun",
    accentColor: "from-yellow-500 to-amber-700"
  },
  {
    id: "barat",
    title: "Reception of Barat",
    day: "Wednesday",
    date: "25th November 2026",
    fullDate: "2026-11-25T18:00:00+05:30",
    time: "6:00 PM",
    venue: "Antilia By Zion, Sonipat",
    description: "Grand royal welcome of the Groom and Barat with shehnai, dhol, and garland exchange (Varmala).",
    iconName: "Crown",
    accentColor: "from-red-700 to-amber-900"
  },
  {
    id: "dinner",
    title: "Royal Wedding Dinner",
    day: "Wednesday",
    date: "25th November 2026",
    fullDate: "2026-11-25T20:00:00+05:30",
    time: "8:00 PM",
    venue: "Antilia By Zion, Sonipat",
    description: "Sumptuous traditional and royal banquet feast laid out for all revered guests and loved ones.",
    iconName: "Utensils",
    accentColor: "from-amber-700 to-orange-950"
  },
  {
    id: "doli",
    title: "Doli (Vidaai)",
    day: "Wednesday Night",
    date: "25th November 2026",
    fullDate: "2026-11-25T23:30:00+05:30",
    time: "Taaron Ki Chhaon Mein",
    venue: "Antilia By Zion, Sonipat",
    description: "Emotional farewell under the celestial canopy of starlight as Ishita embarks on her new journey with Aarnav.",
    iconName: "Moon",
    accentColor: "from-indigo-950 to-blue-900"
  }
];
