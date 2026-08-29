/**
 * WEDDING INVITATION CONFIGURATION — ASHIK & JERRIN
 * 
 * Two Celebrations:
 * 1. The Engagement (12 September 2026, Kamballur, Kasaragod)
 * 2. The Holy Matrimony & Celebration Lunch (21 September 2026, East Fort, Thrissur)
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
    engagementDateISO: "2026-09-12T11:30:00",
    engagementDisplayDate: "Saturday, 12 September 2026",
    engagementTime: "11:30 AM",
    engagementLocation: "Kamballur, Kasaragod",

    // Wedding & Celebration Lunch
    weddingDateISO: "2026-09-21T10:30:00",
    weddingEndISO: "2026-09-21T15:00:00",
    weddingDisplayDate: "Monday, 21 September 2026",
    weddingTime: "10:30 AM",
    weddingLocation: "East Fort, Thrissur",

    // Hero Overview
    heroDates: "12 & 21 September 2026",
    heroLocations: "Kasaragod & Thrissur, Kerala",
    tagline: "invite you to share in two beautiful moments, a promise made and a lifetime begun."
  },

  // Audio / Music (Canon in D by Brooklyn Duo - https://youtu.be/Ptk_1Dc2iPY)
  music: {
    title: "Canon in D (Cello & Piano)",
    artist: "Brooklyn Duo",
    youtubeId: "Ptk_1Dc2iPY",
    youtubeUrl: "https://youtu.be/Ptk_1Dc2iPY"
  },

  // A Note from the Couple
  storyNote: {
    text: "With joyful hearts and the blessings of our parents, we invite you to share in two beautiful moments of our lives: a promise made and a lifetime begun. Your presence, prayers, and blessings mean the world to us as we step into this sacred journey together.",
    signature: "With love & blessings, Ashik & Jerrin",
    storyImage: "assets/images/couple-cathedral.jpg"
  },

  // Couple Gallery Memories
  gallery: [
    {
      image: "assets/images/couple-proposal.jpg",
      caption: "A Promise Made — The Proposal",
      tag: "Engagement"
    },
    {
      image: "assets/images/couple-cathedral.jpg",
      caption: "A Lifetime Begun — The Cathedral",
      tag: "Holy Matrimony"
    },
    {
      image: "assets/images/couple-sunset.jpg",
      caption: "Golden Moments Together",
      tag: "Celebration"
    },
    {
      image: "assets/images/couple-portrait.jpg",
      caption: "Joy & Boundless Love",
      tag: "Ashik & Jerrin"
    }
  ],

  // Two Events Schedule (Editorial 01 & 02)
  schedule: [
    {
      number: "01",
      title: "The Engagement",
      subtitle: "A Promise Made",
      date: "Saturday, 12 September 2026",
      time: "11:30 AM",
      venueName: "Kamballur, Kasaragod",
      badge: "Betrothal Ceremony",
      details: "Join us as we exchange our betrothal vows and blessings amidst family, love, and cherished traditions.",
      venueTargetId: "venue-kamballur"
    },
    {
      number: "02",
      title: "The Holy Matrimony & Celebration Lunch",
      subtitle: "A Lifetime Begun",
      date: "Monday, 21 September 2026",
      time: "10:30 AM (Ceremony) · Followed by Celebration Lunch",
      venueName: "Our Lady of Lourdes Metropolitan Cathedral & Centenary Hall, Thrissur",
      badge: "Wedding & Feast",
      details: "The solemn nuptial ceremony will be solemnized at Our Lady of Lourdes Metropolitan Cathedral at 10:30 AM, followed immediately by a celebratory wedding banquet at Lourdes Centenary Hall.",
      venueTargetId: "venue-thrissur"
    }
  ],

  // Venues Details
  venues: [
    {
      id: "venue-kamballur",
      name: "The Engagement Ceremony",
      type: "Betrothal — Sept 12, 2026",
      time: "11:30 AM",
      address: "Kamballur, Kasaragod, Kerala",
      image: "assets/images/venue-kamballur-church.jpg",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Kamballur+Kasaragod+Kerala",
      features: ["Betrothal Service", "Traditional Blessings", "Kamballur, Kasaragod"]
    },
    {
      id: "venue-thrissur",
      name: "Our Lady of Lourdes Metropolitan Cathedral",
      type: "Holy Matrimony & Celebration Lunch — Sept 21, 2026",
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
    firebaseFirestoreConfig: null
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
