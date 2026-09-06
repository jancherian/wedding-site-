/**
 * WEDDING INVITATION CONFIGURATION — ASHIK & JERRIN
 * 
 * Two Celebrations:
 * 1. The Engagement (12 September 2026, Kamballur, Kasaragod)
 * 2. The Holy Matrimony (21 September 2026, East Fort, Thrissur)
 */

window.WEDDING_CONFIG = {
  // Couple Information
  couple: {
    groom: "Ashik",
    bride: "Jerrin",
    initialsGroom: "A",
    initialsBride: "J",
    monogram: "A & J",
    displayNames: "Ashik & Jerrin",
    eyebrow: "Together with their families"
  },

  // Dates & Locations
  event: {
    // Engagement
    engagementDateISO: "2026-09-12T11:30:00+05:30",
    engagementDisplayDate: "Saturday, 12 September 2026",
    engagementTime: "11:30 AM",
    engagementLocation: "Kamballur, Kasaragod",

    // Wedding (Holy Matrimony)
    weddingDateISO: "2026-09-21T10:30:00+05:30",
    weddingEndISO: "2026-09-21T15:00:00+05:30",
    weddingDisplayDate: "Monday, 21 September 2026",
    weddingTime: "10:30 AM",
    weddingLocation: "East Fort, Thrissur",

    // Hero Overview
    heroDates: "12 & 21 September 2026",
    heroLocations: "Kasaragod & Thrissur, Kerala",
    tagline: "invite you to share in two beautiful moments, a promise made and a lifetime begun."
  },

  // Audio / Music (A Thousand Years by ThePianoGuys - https://music.youtube.com/watch?v=QgaTQ5-XfMM)
  music: {
    title: "A Thousand Years (Piano & Cello Cover)",
    artist: "ThePianoGuys",
    youtubeId: "QgaTQ5-XfMM",
    youtubeUrl: "https://music.youtube.com/watch?v=QgaTQ5-XfMM"
  },

  // A Note from the Couple
  storyNote: {
    text: "With joyful hearts and the blessings of our parents, we invite you to share in two beautiful moments of our lives: a promise made and a lifetime begun. Your presence, prayers, and blessings mean the world to us as we step into this sacred journey together.",
    signature: "With love & blessings, Ashik & Jerrin",
    storyImage: "assets/images/couple-cathedral.jpg"
  },

  // Two Events Schedule (Editorial 01 & 02)
  schedule: [
    {
      number: "01",
      title: "The Engagement",
      subtitle: "A Promise Made",
      date: "Saturday, 12 September 2026",
      time: "11:30 AM",
      venueName: "St. Alphonsa Church, Kamballur, Kasaragod",
      badge: "Betrothal Ceremony",
      details: "Join us as we exchange our betrothal vows and blessings amidst family, love, and cherished traditions.",
      venueTargetId: "venue-kamballur",
      mapsUrl: "https://www.google.com/maps/place/St+Alphonsa+Church,Kamballur/@12.2788933,75.3246468,811m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3ba4676fd037edb1:0xe8363140b688d176!8m2!3d12.2788933!4d75.3272217!16s%2Fg%2F1hm3hkd97"
    },
    {
      number: "02",
      title: "The Holy Matrimony",
      subtitle: "A Lifetime Begun",
      date: "Monday, 21 September 2026",
      time: "10:30 AM (Ceremony) · Followed by Celebration Lunch",
      venueName: "Our Lady of Lourdes Metropolitan Cathedral & Centenary Hall, Thrissur",
      badge: "Wedding & Feast",
      details: "The solemn nuptial ceremony will be solemnized at Our Lady of Lourdes Metropolitan Cathedral at 10:30 AM, followed immediately by a celebratory wedding banquet at Lourdes Centenary Hall.",
      venueTargetId: "venue-thrissur",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Our+Lady+de+Lourdes+Metropolitan+Cathedral+East+Fort+Thrissur"
    }
  ],

  // Venues Details
  venues: [
    {
      id: "venue-kamballur",
      name: "St. Alphonsa Church",
      type: "Betrothal — Sept 12, 2026",
      time: "11:30 AM",
      address: "Kamballur, Kasaragod, Kerala",
      image: "assets/images/venue-kamballur-church.jpg",
      mapsUrl: "https://www.google.com/maps/place/St+Alphonsa+Church,Kamballur/@12.2788933,75.3246468,811m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3ba4676fd037edb1:0xe8363140b688d176!8m2!3d12.2788933!4d75.3272217!16s%2Fg%2F1hm3hkd97",
      features: ["Betrothal Service", "Traditional Blessings", "St. Alphonsa Church, Kamballur"]
    },
    {
      id: "venue-thrissur",
      name: "Our Lady of Lourdes Metropolitan Cathedral",
      type: "Holy Matrimony — Sept 21, 2026",
      time: "10:30 AM · Followed by Lunch at Lourdes Centenary Hall",
      address: "East Fort, Thrissur, Kerala",
      image: "assets/images/venue-lourdes-cathedral.jpg",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Our+Lady+de+Lourdes+Metropolitan+Cathedral+East+Fort+Thrissur",
      features: ["Ceremony: 10:30 AM at Cathedral", "Celebration Lunch: Lourdes Centenary Hall", "East Fort, Thrissur"]
    }
  ],

  // Integrations
  integrations: {
    googleAppsScriptUrl: "",
    formspreeEndpoint: "https://formspree.io/f/mzebaqwa",
    firebaseConfig: {
      apiKey: "AIzaSyAN1TkGG_b51vsshz4DMnq-oNe9NkiSQ0I",
      authDomain: "ashik-jerrin-wedding.firebaseapp.com",
      projectId: "ashik-jerrin-wedding",
      storageBucket: "ashik-jerrin-wedding.firebasestorage.app",
      messagingSenderId: "758124599765",
      appId: "1:758124599765:web:8de0cdf0012ce35577c55c",
      measurementId: "G-CCKQ3XJTGQ"
    }
  },

  // Initial Guestbook Wishes
  initialWishes: [
    {
      id: "w-1",
      name: "Thomas & Mariamma",
      date: "August 26, 2026",
      message: "Dearest Ashik and Jerrin, wishing you both God's abundant grace as you unite in Holy Matrimony. May your journey together be filled with unwavering love, faith, and joy!"
    },
    {
      id: "w-2",
      name: "Kevin & Sneha",
      date: "August 22, 2026",
      message: "Hearty congratulations Ashik & Jerrin! Looking forward to celebrating both the Engagement in Kasaragod and the grand Wedding in Thrissur. Cheers to a lifetime of adventures!"
    },
    {
      id: "w-3",
      name: "Anjali & Family",
      date: "August 18, 2026",
      message: "From Kasaragod to Thrissur, counting down the days to celebrate these two beautiful milestones with you both. Wishing you endless happiness!"
    }
  ]
};
