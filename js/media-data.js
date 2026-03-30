/* ============================================
   Tehilah World Worship - Media Hub Data

   To add new media items, simply add an object
   to the MEDIA_DATA array below with these fields:

   title       - Display title (required)
   date        - Date string, e.g. "March 5, 2026" (required)
   nation      - Country/nation tag (required)
   category    - One of: "Nation Videos", "Countdown Clips",
                 "Participation Photos", "Live Highlights",
                 "Recap & Testimonies" (required)
   platform    - One of: "YouTube", "Instagram", "TikTok", "Photo" (required)
   url         - Full URL to the content (required for video/social)
   thumbnail   - Image URL for photos (optional, used for Photo type)
   description - Short description (optional)
   ============================================ */

const MEDIA_DATA = [
  {
    title: "The Glory — Announcement Reel",
    date: "March 28, 2026",
    nation: "Global",
    category: "Countdown Clips",
    platform: "Instagram",
    url: "https://www.instagram.com/reel/DVg7QQTjAnJ/",
    description: "Official announcement for The Glory — 12-Hour Charge, April 13–14."
  },
  {
    title: "Tehilah World Worship Recap",
    date: "March 26, 2026",
    nation: "Global",
    category: "Recap & Testimonies",
    platform: "Instagram",
    url: "https://www.instagram.com/reel/DVXpwtjDP2X/",
    description: "A recap of the 21 Days of Prayer and 12-Hour Worship."
  },
  {
    title: "Worship Highlights Reel",
    date: "March 24, 2026",
    nation: "Global",
    category: "Live Highlights",
    platform: "Instagram",
    url: "https://www.instagram.com/reel/DV7vxYhjB-4/",
    description: "Highlights from the global worship gathering."
  },
  {
    title: "Nations in Worship",
    date: "March 23, 2026",
    nation: "Global",
    category: "Nation Videos",
    platform: "Instagram",
    url: "https://www.instagram.com/reel/DV5W9t3jPCi/",
    description: "Worshippers from across the nations joining together."
  },
  {
    title: "Live Worship Moment",
    date: "March 21, 2026",
    nation: "Global",
    category: "Live Highlights",
    platform: "Instagram",
    url: "https://www.instagram.com/reel/DVsRKBQjFKU/",
    description: "A powerful live worship moment from the 12-Hour Charge."
  },
  {
    title: "Praise & Intercession Clip",
    date: "March 20, 2026",
    nation: "Global",
    category: "Countdown Clips",
    platform: "Instagram",
    url: "https://www.instagram.com/reel/DVlGd7zDLWQ/",
    description: "Worship and intercession in the final countdown."
  },
  {
    title: "Community Testimony Post",
    date: "March 29, 2026",
    nation: "Global",
    category: "Recap & Testimonies",
    platform: "Instagram",
    url: "https://www.instagram.com/p/DWGlBJUjCpz/",
    description: "Testimonies from the global worship community."
  },
  {
    title: "Participation from the Nations",
    date: "March 18, 2026",
    nation: "Global",
    category: "Participation Photos",
    platform: "Instagram",
    url: "https://www.instagram.com/p/DVRhG46jDVR/",
    description: "Photos and posts from worshippers around the world."
  }
];
