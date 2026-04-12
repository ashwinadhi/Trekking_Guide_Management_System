export interface Trek {
  id: string
  slug: string
  name: string
  description: string
  price: number
  duration: string
  difficulty: string
  location: string
  rating: number
  reviews: number
  images: string[]
  startDate: string
  endDate: string
  included: string[]
  maxGroupSize: number
  minAge: number
  guide: {
    name: string
    title: string
    bio: string
    image: string
    experience: string
    languages: string[]
  }
  routeHighlights: {
    name: string
    description: string
    importance: "high" | "medium" | "low"
    image: string
  }[]
  detailedItinerary: {
    day: number
    title: string
    description: string
    walkingTime: string
    altitude: string
    highlights: string[]
    accommodation: string
    meals: string
  }[]
}

export const allTreks: Trek[] = [
  {
    id: "1",
    slug: "everest-base-camp",
    name: "Everest Base Camp Trek",
    description:
      "Experience the ultimate Himalayan adventure with our 14-day journey to Everest Base Camp. This iconic trek takes you through the heart of the Khumbu region, home to the legendary Sherpa people. Walk in the footsteps of mountaineering legends as you traverse ancient trade routes, cross suspension bridges over roaring rivers, and witness some of the most spectacular mountain scenery on Earth.",
    price: 1850,
    duration: "14 days",
    difficulty: "Challenging",
    location: "Khumbu Region, Nepal",
    rating: 4.9,
    reviews: 127,
    images: [
      "/images/everest-base-camp.jpg",
      "/images/mountain-sunrise.jpg",
      "/images/sherpa-village.jpg",
      "/images/prayer-flags.jpg",
      "/images/gokyo-lakes.jpg",
    ],
    startDate: "2024-03-15",
    endDate: "2024-03-28",
    maxGroupSize: 12,
    minAge: 16,
    included: [
      "Professional English-speaking guide",
      "All meals during the trek",
      "Tea house accommodation",
      "Sagarmatha National Park permits",
      "TIMS card",
      "Airport transfers",
      "First aid kit and emergency evacuation insurance",
    ],
    guide: {
      name: "Pemba Sherpa",
      title: "Senior Mountain Guide",
      bio: "Born and raised in the Everest region, Pemba has been guiding trekkers to Everest Base Camp for over 12 years. His deep knowledge of Sherpa culture and mountain safety makes him one of the most sought-after guides in the region.",
      image: "/images/sherpa-village.jpg",
      experience: "12+ years",
      languages: ["English", "Nepali", "Sherpa", "Hindi"],
    },
    routeHighlights: [
      {
        name: "Everest Base Camp (5,364m)",
        description:
          "Stand at the base of the world's highest mountain and witness the incredible Khumbu Icefall where climbers begin their summit attempts.",
        importance: "high",
        image: "/images/everest-base-camp.jpg",
      },
      {
        name: "Kala Patthar (5,545m)",
        description:
          "The best viewpoint for Mount Everest, offering breathtaking sunrise views over the world's highest peaks.",
        importance: "high",
        image: "/images/mountain-sunrise.jpg",
      },
      {
        name: "Namche Bazaar",
        description:
          "The bustling Sherpa capital and gateway to Everest, perfect for acclimatization and cultural immersion.",
        importance: "medium",
        image: "/images/sherpa-village.jpg",
      },
      {
        name: "Tengboche Monastery",
        description:
          "Ancient Buddhist monastery with stunning mountain views and spiritual significance for the Sherpa people.",
        importance: "medium",
        image: "/images/prayer-flags.jpg",
      },
    ],
    detailedItinerary: [
      {
        day: 1,
        title: "Fly to Lukla, Trek to Phakding",
        description:
          "Early morning flight to Lukla (2,840m), one of the world's most thrilling airports. Begin trekking through beautiful pine forests and Sherpa villages to reach Phakding.",
        walkingTime: "3-4 hours",
        altitude: "2,610m",
        highlights: ["Scenic mountain flight", "First taste of Sherpa culture", "Dudh Koshi River views"],
        accommodation: "Tea house",
        meals: "Lunch, Dinner",
      },
      {
        day: 2,
        title: "Trek to Namche Bazaar",
        description:
          "Cross several suspension bridges and enter Sagarmatha National Park. The trail climbs steeply to Namche Bazaar, the Sherpa capital.",
        walkingTime: "6-7 hours",
        altitude: "3,440m",
        highlights: ["Sagarmatha National Park entry", "First Everest views", "Hillary Suspension Bridge"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 3,
        title: "Acclimatization Day in Namche",
        description:
          "Rest day for acclimatization. Optional hike to Everest View Hotel or visit the Sherpa Museum and local markets.",
        walkingTime: "3-4 hours (optional)",
        altitude: "3,440m",
        highlights: ["Sherpa Museum visit", "Everest View Hotel", "Local market exploration"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 4,
        title: "Trek to Tengboche",
        description:
          "Descend to Dudh Koshi River and climb through rhododendron forests to reach Tengboche Monastery with spectacular mountain views.",
        walkingTime: "5-6 hours",
        altitude: "3,860m",
        highlights: ["Tengboche Monastery", "Ama Dablam views", "Evening prayers ceremony"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 5,
        title: "Trek to Dingboche",
        description:
          "Continue through alpine meadows and yak pastures. The landscape becomes more barren as we gain altitude.",
        walkingTime: "5-6 hours",
        altitude: "4,410m",
        highlights: ["Alpine scenery", "Yak herds", "Island Peak views"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 6,
        title: "Acclimatization Day in Dingboche",
        description:
          "Another important acclimatization day. Optional hike to Nagarjun Hill for panoramic mountain views.",
        walkingTime: "4-5 hours (optional)",
        altitude: "4,410m",
        highlights: ["Nagarjun Hill hike", "Panoramic mountain views", "Rest and recovery"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 7,
        title: "Trek to Lobuche",
        description:
          "Trek through the terminal moraine of Khumbu Glacier. Pass memorials to climbers who lost their lives on Everest.",
        walkingTime: "5-6 hours",
        altitude: "4,910m",
        highlights: ["Khumbu Glacier views", "Climber memorials", "High altitude landscape"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 8,
        title: "Trek to Everest Base Camp via Gorak Shep",
        description:
          "The big day! Trek to Gorak Shep, then continue to Everest Base Camp. Stand at the foot of the world's highest mountain.",
        walkingTime: "7-8 hours",
        altitude: "5,364m",
        highlights: ["Everest Base Camp arrival", "Khumbu Icefall views", "Achievement celebration"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 9,
        title: "Hike Kala Patthar, Descend to Pheriche",
        description:
          "Early morning hike to Kala Patthar for the best Everest views and sunrise. Descend to Pheriche for the night.",
        walkingTime: "7-8 hours",
        altitude: "4,240m",
        highlights: ["Kala Patthar summit", "Everest sunrise views", "Descent begins"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 10,
        title: "Trek to Namche Bazaar",
        description:
          "Long descent through familiar territory. Enjoy the thicker air and warmer temperatures as we lose altitude.",
        walkingTime: "6-7 hours",
        altitude: "3,440m",
        highlights: ["Rapid descent", "Thicker air relief", "Familiar villages"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 11,
        title: "Trek to Lukla",
        description:
          "Final day of trekking. Descend through pine forests and Sherpa villages back to Lukla. Celebration dinner with the team.",
        walkingTime: "6-7 hours",
        altitude: "2,840m",
        highlights: ["Trek completion", "Team celebration", "Reflection on achievement"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 12,
        title: "Fly back to Kathmandu",
        description: "Morning flight back to Kathmandu. Rest day in the capital with optional sightseeing or shopping.",
        walkingTime: "Flight day",
        altitude: "1,400m",
        highlights: ["Return flight", "Kathmandu arrival", "Hot shower and comfortable bed"],
        accommodation: "Hotel",
        meals: "Breakfast",
      },
    ],
  },
  {
    id: "2",
    slug: "annapurna-circuit",
    name: "Annapurna Circuit Trek",
    description:
      "Embark on one of the world's most diverse trekking experiences with the classic Annapurna Circuit. This 16-day adventure takes you around the entire Annapurna massif, crossing the challenging Thorong La Pass at 5,416m. Experience incredible biodiversity as you journey from subtropical forests to high alpine deserts, encountering diverse cultures from Hindu valleys to Tibetan Buddhist highlands.",
    price: 1450,
    duration: "16 days",
    difficulty: "Moderate to Challenging",
    location: "Annapurna Region, Nepal",
    rating: 4.8,
    reviews: 89,
    images: [
      "/images/annapurna-circuit.jpg",
      "/images/mountain-sunrise.jpg",
      "/images/prayer-flags.jpg",
      "/images/sherpa-village.jpg",
      "/images/langtang-valley.jpg",
    ],
    startDate: "2024-03-20",
    endDate: "2024-04-04",
    maxGroupSize: 14,
    minAge: 14,
    included: [
      "Experienced trekking guide",
      "All meals during trek",
      "Tea house accommodation",
      "ACAP and TIMS permits",
      "Transportation to/from trailhead",
      "First aid kit",
      "Group medical kit",
    ],
    guide: {
      name: "Raj Gurung",
      title: "Annapurna Specialist Guide",
      bio: "Raj has been leading treks in the Annapurna region for over 10 years. His expertise in high-altitude trekking and knowledge of local Gurung and Thakali cultures makes him an exceptional guide for this diverse circuit.",
      image: "/images/mountain-sunrise.jpg",
      experience: "10+ years",
      languages: ["English", "Nepali", "Gurung", "Hindi"],
    },
    routeHighlights: [
      {
        name: "Thorong La Pass (5,416m)",
        description:
          "The highest point of the trek, offering spectacular views of the Annapurna and Dhaulagiri ranges.",
        importance: "high",
        image: "/images/annapurna-circuit.jpg",
      },
      {
        name: "Muktinath Temple",
        description:
          "Sacred pilgrimage site for both Hindus and Buddhists, featuring eternal flames and 108 water spouts.",
        importance: "high",
        image: "/images/prayer-flags.jpg",
      },
      {
        name: "Poon Hill (3,210m)",
        description: "Famous sunrise viewpoint offering panoramic views of Annapurna and Dhaulagiri mountain ranges.",
        importance: "medium",
        image: "/images/mountain-sunrise.jpg",
      },
      {
        name: "Manang Village",
        description: "Traditional Tibetan Buddhist village perfect for acclimatization and cultural immersion.",
        importance: "medium",
        image: "/images/sherpa-village.jpg",
      },
    ],
    detailedItinerary: [
      {
        day: 1,
        title: "Drive to Besisahar, Trek to Bhulbhule",
        description:
          "Drive from Kathmandu to Besisahar, then begin trekking through terraced fields and traditional villages to Bhulbhule.",
        walkingTime: "4-5 hours",
        altitude: "840m",
        highlights: ["Trek begins", "Terraced farmlands", "Marsyangdi River"],
        accommodation: "Tea house",
        meals: "Lunch, Dinner",
      },
      {
        day: 2,
        title: "Trek to Jagat",
        description: "Continue along the Marsyangdi River through beautiful forests and traditional Gurung villages.",
        walkingTime: "6-7 hours",
        altitude: "1,300m",
        highlights: ["Gurung villages", "Subtropical forests", "River crossings"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 3,
        title: "Trek to Dharapani",
        description:
          "Enter the restricted area of Annapurna Conservation Area. The landscape begins to change as we gain altitude.",
        walkingTime: "6-7 hours",
        altitude: "1,860m",
        highlights: ["ACAP entry", "Changing landscapes", "Mountain views begin"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 4,
        title: "Trek to Chame",
        description:
          "Trek through pine and fir forests with first clear views of Annapurna II. Chame is the district headquarters of Manang.",
        walkingTime: "5-6 hours",
        altitude: "2,670m",
        highlights: ["Annapurna II views", "Pine forests", "District headquarters"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 5,
        title: "Trek to Pisang",
        description: "Cross several bridges and climb through forests to reach Pisang with spectacular mountain views.",
        walkingTime: "5-6 hours",
        altitude: "3,200m",
        highlights: ["Mountain panoramas", "Traditional architecture", "Buddhist culture begins"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 6,
        title: "Trek to Manang",
        description:
          "Choose between upper and lower routes to Manang. Both offer spectacular mountain views and cultural experiences.",
        walkingTime: "6-7 hours",
        altitude: "3,519m",
        highlights: ["Route options", "Manang village", "Tibetan Buddhist culture"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 7,
        title: "Acclimatization Day in Manang",
        description:
          "Important rest day for acclimatization. Optional hikes to Gangapurna Lake or Ice Lake for better acclimatization.",
        walkingTime: "4-5 hours (optional)",
        altitude: "3,519m",
        highlights: ["Acclimatization hikes", "Gangapurna Lake", "Rest and recovery"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 8,
        title: "Trek to Yak Kharka",
        description:
          "Leave the tree line behind and enter high alpine terrain. Spectacular views of Annapurna III and Gangapurna.",
        walkingTime: "4-5 hours",
        altitude: "4,018m",
        highlights: ["Alpine terrain", "Yak pastures", "High altitude adaptation"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 9,
        title: "Trek to Thorong Phedi",
        description:
          "Short but steep climb to Thorong Phedi, the base camp for crossing Thorong La Pass. Early rest for tomorrow's big day.",
        walkingTime: "3-4 hours",
        altitude: "4,450m",
        highlights: ["Pass preparation", "High altitude camp", "Mental preparation"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 10,
        title: "Cross Thorong La Pass to Muktinath",
        description:
          "The most challenging day! Early start to cross Thorong La Pass (5,416m), then descend to the sacred site of Muktinath.",
        walkingTime: "8-9 hours",
        altitude: "3,760m",
        highlights: ["Thorong La Pass crossing", "Highest point achievement", "Muktinath Temple"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 11,
        title: "Trek to Marpha",
        description:
          "Descend through the Kali Gandaki valley, known as the world's deepest gorge. Visit traditional Thakali village of Marpha.",
        walkingTime: "4-5 hours",
        altitude: "2,670m",
        highlights: ["World's deepest gorge", "Thakali culture", "Apple brandy tasting"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 12,
        title: "Trek to Kalopani",
        description: "Continue down the Kali Gandaki valley with views of Dhaulagiri and Nilgiri peaks.",
        walkingTime: "5-6 hours",
        altitude: "2,530m",
        highlights: ["Dhaulagiri views", "Valley descent", "Changing landscapes"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 13,
        title: "Trek to Tatopani",
        description: "Descend to Tatopani, famous for its natural hot springs. Perfect for relaxing tired muscles.",
        walkingTime: "6-7 hours",
        altitude: "1,190m",
        highlights: ["Natural hot springs", "Muscle relaxation", "Lower altitude relief"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 14,
        title: "Trek to Ghorepani",
        description: "Climb steeply through rhododendron forests to reach Ghorepani, gateway to Poon Hill.",
        walkingTime: "7-8 hours",
        altitude: "2,874m",
        highlights: ["Rhododendron forests", "Steep ascent", "Poon Hill preparation"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 15,
        title: "Poon Hill Sunrise, Trek to Nayapul",
        description:
          "Early morning hike to Poon Hill for spectacular sunrise views, then descend to Nayapul and drive to Pokhara.",
        walkingTime: "6-7 hours",
        altitude: "822m",
        highlights: ["Poon Hill sunrise", "Circuit completion", "Return to civilization"],
        accommodation: "Hotel",
        meals: "Breakfast, Lunch",
      },
      {
        day: 16,
        title: "Return to Kathmandu",
        description:
          "Drive or fly back to Kathmandu. Celebration dinner and reflection on the incredible journey completed.",
        walkingTime: "Travel day",
        altitude: "1,400m",
        highlights: ["Journey completion", "Celebration dinner", "Achievement reflection"],
        accommodation: "Hotel",
        meals: "Breakfast",
      },
    ],
  },
  {
    id: "3",
    slug: "langtang-valley",
    name: "Langtang Valley Trek",
    description:
      'Discover the hidden gem of Langtang Valley, often called the "Valley of Glaciers." This 10-day trek offers an intimate experience with Tamang culture and stunning mountain scenery without the crowds of more popular routes. Journey through rhododendron forests, traditional villages, and high alpine meadows while enjoying close-up views of Langtang Lirung and other magnificent peaks.',
    price: 950,
    duration: "10 days",
    difficulty: "Easy to Moderate",
    location: "Langtang Region, Nepal",
    rating: 4.7,
    reviews: 64,
    images: [
      "/images/langtang-valley.jpg",
      "/images/sherpa-village.jpg",
      "/images/prayer-flags.jpg",
      "/images/mountain-sunrise.jpg",
      "/images/gokyo-lakes.jpg",
    ],
    startDate: "2024-03-25",
    endDate: "2024-04-03",
    maxGroupSize: 12,
    minAge: 12,
    included: [
      "Professional trekking guide",
      "All meals during trek",
      "Tea house accommodation",
      "Langtang National Park permits",
      "TIMS card",
      "Transportation to/from Syabrubesi",
      "First aid kit",
    ],
    guide: {
      name: "Karma Tamang",
      title: "Langtang Local Guide",
      bio: "A native of the Langtang region, Karma has an unparalleled understanding of the local trails, culture, and wildlife. He is passionate about sharing the beauty of his homeland with trekkers.",
      image: "/images/prayer-flags.jpg",
      experience: "8+ years",
      languages: ["English", "Nepali", "Tamang"],
    },
    routeHighlights: [
      {
        name: "Kyanjin Gompa (3,870m)",
        description:
          "A beautiful monastery and a high-altitude settlement offering panoramic views of Langtang Lirung and surrounding peaks.",
        importance: "high",
        image: "/images/langtang-valley.jpg",
      },
      {
        name: "Langtang Village",
        description:
          "Rebuilt village after the 2015 earthquake, showcasing the resilience of the local community and offering insights into their daily life.",
        importance: "medium",
        image: "/images/sherpa-village.jpg",
      },
      {
        name: "Langtang Lirung (7,227m)",
        description: "The highest peak in the Langtang Himal, offering stunning close-up views throughout the trek.",
        importance: "high",
        image: "/images/mountain-sunrise.jpg",
      },
      {
        name: "Tamang Heritage Trail",
        description:
          "Opportunity to explore the rich cultural heritage of the Tamang people, their traditions, and hospitality.",
        importance: "medium",
        image: "/images/prayer-flags.jpg",
      },
    ],
    detailedItinerary: [
      {
        day: 1,
        title: "Drive to Syabrubesi",
        description:
          "Scenic drive from Kathmandu to Syabrubesi, the starting point of the Langtang Valley Trek. Enjoy views of rural Nepal.",
        walkingTime: "7-8 hours (drive)",
        altitude: "1,550m",
        highlights: ["Scenic drive", "Rural Nepal views", "Trek starting point"],
        accommodation: "Tea house",
        meals: "Lunch, Dinner",
      },
      {
        day: 2,
        title: "Trek to Lama Hotel",
        description:
          "Begin trekking along the Langtang Khola (river) through lush rhododendron and bamboo forests. Keep an eye out for wildlife.",
        walkingTime: "6-7 hours",
        altitude: "2,380m",
        highlights: ["Rhododendron forests", "Langtang Khola", "Wildlife spotting (monkeys, red pandas)"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 3,
        title: "Trek to Langtang Village",
        description:
          "Continue ascending through dense forests. The valley opens up as you approach Langtang Village, rebuilt after the earthquake.",
        walkingTime: "5-6 hours",
        altitude: "3,430m",
        highlights: ["Valley views", "Rebuilt Langtang village", "Local community interaction"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 4,
        title: "Trek to Kyanjin Gompa",
        description:
          "A shorter trek today, allowing for better acclimatization. Reach Kyanjin Gompa, a beautiful high-altitude settlement with a monastery.",
        walkingTime: "3-4 hours",
        altitude: "3,870m",
        highlights: ["Kyanjin Gompa monastery", "Panoramic mountain views", "Acclimatization walk"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 5,
        title: "Explore Kyanjin Gompa (Acclimatization)",
        description:
          "Rest and acclimatization day. Optional hikes to Kyanjin Ri (4,773m) or Tserko Ri (5,000m) for stunning panoramic views of the Langtang range.",
        walkingTime: "4-6 hours (optional)",
        altitude: "3,870m",
        highlights: ["Kyanjin Ri/Tserko Ri hike", "Glacier views", "Cheese factory visit"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 6,
        title: "Trek back to Lama Hotel",
        description:
          "Begin the descent, retracing your steps through the beautiful valley. Enjoy the views from a different perspective.",
        walkingTime: "6-7 hours",
        altitude: "2,380m",
        highlights: ["Descent views", "Familiar trails", "Relaxed pace"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 7,
        title: "Trek back to Syabrubesi",
        description: "Continue the descent to Syabrubesi, marking the end of the trekking part of the journey.",
        walkingTime: "5-6 hours",
        altitude: "1,550m",
        highlights: ["Trek completion", "Celebration dinner", "Hot shower anticipation"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 8,
        title: "Drive back to Kathmandu",
        description: "Scenic drive back to Kathmandu, reflecting on the incredible journey through Langtang Valley.",
        walkingTime: "7-8 hours (drive)",
        altitude: "1,400m",
        highlights: ["Return to Kathmandu", "Comfortable hotel", "Souvenir shopping"],
        accommodation: "Hotel",
        meals: "Breakfast",
      },
    ],
  },
  {
    id: "4",
    slug: "manaslu-circuit",
    name: "Manaslu Circuit Trek",
    description:
      "Embark on an off-the-beaten-path adventure with the Manaslu Circuit Trek, a restricted area trek offering raw Himalayan beauty and rich Tibetan culture. This 18-day journey circumnavigates Mount Manaslu (8,163m), the world's eighth highest peak, crossing the challenging Larkya La Pass (5,106m). Experience remote villages, pristine landscapes, and unparalleled mountain vistas.",
    price: 2200,
    duration: "18 days",
    difficulty: "Challenging",
    location: "Manaslu Region, Nepal",
    rating: 4.9,
    reviews: 45,
    images: [
      "/images/manaslu-circuit.jpg",
      "/images/prayer-flags.jpg",
      "/images/sherpa-village.jpg",
      "/images/mountain-sunrise.jpg",
      "/images/upper-mustang.jpg",
    ],
    startDate: "2024-04-01",
    endDate: "2024-04-18",
    maxGroupSize: 10,
    minAge: 18,
    included: [
      "Licensed trekking guide and porters",
      "All meals during trek",
      "Tea house accommodation",
      "Manaslu Restricted Area Permit",
      "ACAP and MCAP permits",
      "Transportation to/from trailhead",
      "First aid kit and emergency support",
    ],
    guide: {
      name: "Nima Sherpa",
      title: "Manaslu Expedition Guide",
      bio: "Nima is an experienced high-altitude guide specializing in the Manaslu region. His calm demeanor and extensive knowledge of the challenging terrain ensure a safe and rewarding trek.",
      image: "/images/manaslu-circuit.jpg",
      experience: "15+ years",
      languages: ["English", "Nepali", "Tibetan"],
    },
    routeHighlights: [
      {
        name: "Larkya La Pass (5,106m)",
        description:
          "The highest point of the trek, offering panoramic views of Himlung Himal, Cheo Himal, Annapurna II, and Manaslu.",
        importance: "high",
        image: "/images/manaslu-circuit.jpg",
      },
      {
        name: "Manaslu Base Camp",
        description: "A glimpse of the expedition life at the base of the world's eighth highest mountain.",
        importance: "medium",
        image: "/images/mountain-sunrise.jpg",
      },
      {
        name: "Tsum Valley",
        description:
          "Optional side trip to a sacred Buddhist pilgrimage valley, rich in ancient monasteries and unique culture.",
        importance: "low",
        image: "/images/prayer-flags.jpg",
      },
      {
        name: "Traditional Gurung Villages",
        description:
          "Experience the authentic lifestyle and hospitality of the Gurung and Tibetan communities along the route.",
        importance: "medium",
        image: "/images/sherpa-village.jpg",
      },
    ],
    detailedItinerary: [
      {
        day: 1,
        title: "Drive to Soti Khola",
        description:
          "Long scenic drive from Kathmandu to Soti Khola, the starting point of the Manaslu Circuit Trek. Enjoy views of rural landscapes and rivers.",
        walkingTime: "7-8 hours (drive)",
        altitude: "710m",
        highlights: ["Scenic drive", "Rural Nepal", "Trek starting point"],
        accommodation: "Tea house",
        meals: "Lunch, Dinner",
      },
      {
        day: 2,
        title: "Trek to Machha Khola",
        description:
          "Begin trekking through Sal forests, terraced fields, and waterfalls. The trail follows the Budhi Gandaki River.",
        walkingTime: "6-7 hours",
        altitude: "900m",
        highlights: ["Budhi Gandaki River", "Waterfalls", "Terraced fields"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 3,
        title: "Trek to Jagat",
        description:
          "Cross several suspension bridges and pass through traditional villages. Enter the Manaslu Conservation Area.",
        walkingTime: "6-7 hours",
        altitude: "1,410m",
        highlights: ["Suspension bridges", "Manaslu Conservation Area entry", "Traditional villages"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 4,
        title: "Trek to Deng",
        description:
          "Continue through dense forests and cross the Budhi Gandaki. The valley narrows and the landscape becomes more rugged.",
        walkingTime: "6-7 hours",
        altitude: "1,800m",
        highlights: ["Narrow valley", "Rugged landscape", "Buddhist prayer flags"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 5,
        title: "Trek to Namrung",
        description:
          "Ascend through beautiful rhododendron and pine forests. Reach Namrung, a large village with stunning views of Ganesh Himal.",
        walkingTime: "6-7 hours",
        altitude: "2,660m",
        highlights: ["Rhododendron forests", "Ganesh Himal views", "Traditional architecture"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 6,
        title: "Trek to Samagaon",
        description:
          "Continue through picturesque villages like Lho and Shyala, offering incredible views of Manaslu and Himchuli. Reach Samagaon, a large Tibetan village.",
        walkingTime: "6-7 hours",
        altitude: "3,530m",
        highlights: ["Manaslu views", "Tibetan culture", "Samagaon monastery"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 7,
        title: "Acclimatization Day in Samagaon",
        description:
          "Rest day for acclimatization. Optional hikes to Manaslu Base Camp (4,800m) or Birendra Lake for stunning views.",
        walkingTime: "4-6 hours (optional)",
        altitude: "3,530m",
        highlights: ["Manaslu Base Camp hike", "Birendra Lake", "Acclimatization"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 8,
        title: "Trek to Samdo",
        description:
          "Short trek to Samdo, a remote village near the Tibetan border. Enjoy views of the surrounding peaks and glaciers.",
        walkingTime: "3-4 hours",
        altitude: "3,860m",
        highlights: ["Tibetan border views", "Remote village life", "Glacier views"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 9,
        title: "Acclimatization Day in Samdo (Optional Tsum Valley)",
        description:
          "Another acclimatization day. Optional hike to a viewpoint near the Tibetan border or a side trip to Tsum Valley (requires extra permits).",
        walkingTime: "4-5 hours (optional)",
        altitude: "3,860m",
        highlights: ["Tibetan border viewpoint", "Tsum Valley option", "Rest and preparation"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 10,
        title: "Trek to Larkya Phedi (Dharamsala)",
        description:
          "Ascend to Larkya Phedi, also known as Dharamsala, the last tea house before the pass. Prepare for tomorrow's challenging crossing.",
        walkingTime: "4-5 hours",
        altitude: "4,460m",
        highlights: ["Pass preparation", "High altitude camp", "Stunning evening views"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 11,
        title: "Cross Larkya La Pass to Bimthang",
        description:
          "The most challenging day! Early start to cross Larkya La Pass (5,106m), then a long descent to Bimthang.",
        walkingTime: "8-10 hours",
        altitude: "3,720m",
        highlights: ["Larkya La Pass crossing", "Panoramic mountain views", "Long descent"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 12,
        title: "Trek to Tilije",
        description: "Descend through beautiful forests and pastures. The trail becomes easier as we lose altitude.",
        walkingTime: "5-6 hours",
        altitude: "2,300m",
        highlights: ["Forest descent", "Easier trail", "Return to lower altitudes"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 13,
        title: "Trek to Tal",
        description: "Continue descending to Tal, a village located on a flat riverbed. Enjoy the warmer temperatures.",
        walkingTime: "5-6 hours",
        altitude: "1,700m",
        highlights: ["Riverbed village", "Warmer climate", "Relaxed trekking"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 14,
        title: "Trek to Syange",
        description: "Final day of trekking. Descend to Syange, where the trek officially ends.",
        walkingTime: "6-7 hours",
        altitude: "1,100m",
        highlights: ["Trek completion", "Celebration", "Hot shower anticipation"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 15,
        title: "Drive back to Kathmandu",
        description: "Long scenic drive back to Kathmandu, reflecting on the incredible Manaslu Circuit adventure.",
        walkingTime: "7-8 hours (drive)",
        altitude: "1,400m",
        highlights: ["Return to Kathmandu", "Comfortable hotel", "Souvenir shopping"],
        accommodation: "Hotel",
        meals: "Breakfast",
      },
    ],
  },
  {
    id: "5",
    slug: "gokyo-lakes",
    name: "Gokyo Lakes Trek",
    description:
      "Explore the pristine turquoise lakes of Gokyo Valley, an alternative and equally stunning trek in the Everest region. This 12-day journey takes you to a series of sacred glacial lakes and offers panoramic views of Everest, Lhotse, Makalu, and Cho Oyu from Gokyo Ri. Experience the tranquility of a less crowded trail and the unique beauty of the Ngozumpa Glacier.",
    price: 1700,
    duration: "12 days",
    difficulty: "Challenging",
    location: "Khumbu Region, Nepal",
    rating: 4.8,
    reviews: 78,
    images: [
      "/images/gokyo-lakes.jpg",
      "/images/mountain-sunrise.jpg",
      "/images/prayer-flags.jpg",
      "/images/everest-base-camp.jpg",
      "/images/sherpa-village.jpg",
    ],
    startDate: "2024-04-05",
    endDate: "2024-04-16",
    maxGroupSize: 10,
    minAge: 15,
    included: [
      "Professional English-speaking guide",
      "All meals during the trek",
      "Tea house accommodation",
      "Sagarmatha National Park permits",
      "TIMS card",
      "Airport transfers",
      "First aid kit",
    ],
    guide: {
      name: "Pasang Sherpa",
      title: "Gokyo Valley Expert",
      bio: "Pasang is a local Sherpa guide with extensive experience in the Gokyo Valley. His knowledge of the trails, local customs, and commitment to safety make him an ideal companion for this beautiful trek.",
      image: "/images/gokyo-lakes.jpg",
      experience: "9+ years",
      languages: ["English", "Nepali", "Sherpa"],
    },
    routeHighlights: [
      {
        name: "Gokyo Ri (5,357m)",
        description:
          "Summit offering unparalleled panoramic views of Everest, Lhotse, Makalu, Cho Oyu, and the Gokyo Lakes.",
        importance: "high",
        image: "/images/mountain-sunrise.jpg",
      },
      {
        name: "Gokyo Lakes",
        description:
          "A series of six stunning turquoise glacial lakes, considered sacred by both Hindus and Buddhists.",
        importance: "high",
        image: "/images/gokyo-lakes.jpg",
      },
      {
        name: "Ngozumpa Glacier",
        description: "The longest glacier in the Himalayas, offering a unique landscape and a challenging crossing.",
        importance: "medium",
        image: "/images/everest-base-camp.jpg",
      },
      {
        name: "Dole",
        description:
          "A small village offering stunning views of Thamserku and Kusum Kanguru, and a good acclimatization stop.",
        importance: "low",
        image: "/images/sherpa-village.jpg",
      },
    ],
    detailedItinerary: [
      {
        day: 1,
        title: "Fly to Lukla, Trek to Phakding",
        description:
          "Early morning flight to Lukla (2,840m). Begin trekking through beautiful pine forests and Sherpa villages to reach Phakding.",
        walkingTime: "3-4 hours",
        altitude: "2,610m",
        highlights: ["Scenic mountain flight", "First taste of Sherpa culture", "Dudh Koshi River views"],
        accommodation: "Tea house",
        meals: "Lunch, Dinner",
      },
      {
        day: 2,
        title: "Trek to Namche Bazaar",
        description:
          "Cross several suspension bridges and enter Sagarmatha National Park. The trail climbs steeply to Namche Bazaar, the Sherpa capital.",
        walkingTime: "6-7 hours",
        altitude: "3,440m",
        highlights: ["Sagarmatha National Park entry", "First Everest views", "Hillary Suspension Bridge"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 3,
        title: "Acclimatization Day in Namche",
        description:
          "Rest day for acclimatization. Optional hike to Everest View Hotel or visit the Sherpa Museum and local markets.",
        walkingTime: "3-4 hours (optional)",
        altitude: "3,440m",
        highlights: ["Sherpa Museum visit", "Everest View Hotel", "Local market exploration"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 4,
        title: "Trek to Dole",
        description:
          "Leave the main EBC trail and head towards Gokyo. Trek through rhododendron forests with views of Ama Dablam and Thamserku.",
        walkingTime: "6-7 hours",
        altitude: "4,200m",
        highlights: ["Gokyo trail divergence", "Rhododendron forests", "Ama Dablam views"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 5,
        title: "Trek to Machhermo",
        description:
          "Continue ascending through high pastures. Pass small settlements and enjoy views of Cho Oyu and Kangtega.",
        walkingTime: "4-5 hours",
        altitude: "4,470m",
        highlights: ["High pastures", "Cho Oyu views", "Acclimatization gain"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 6,
        title: "Trek to Gokyo",
        description:
          "Reach the first of the Gokyo Lakes, then continue to the main Gokyo village by the third lake. Enjoy the stunning turquoise waters.",
        walkingTime: "4-5 hours",
        altitude: "4,790m",
        highlights: ["Gokyo Lakes arrival", "Turquoise waters", "Gokyo village"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 7,
        title: "Hike Gokyo Ri, Explore Lakes",
        description:
          "Early morning hike to Gokyo Ri (5,357m) for panoramic views of Everest, Lhotse, Makalu, Cho Oyu, and the Gokyo Lakes. Explore the other lakes in the afternoon.",
        walkingTime: "5-6 hours",
        altitude: "4,790m",
        highlights: ["Gokyo Ri summit", "Panoramic Everest views", "Lake exploration"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 8,
        title: "Trek back to Dole",
        description: "Begin the descent, retracing your steps through the beautiful Gokyo Valley.",
        walkingTime: "6-7 hours",
        altitude: "4,200m",
        highlights: ["Descent begins", "Familiar trails", "Relaxed pace"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 9,
        title: "Trek back to Namche Bazaar",
        description: "Continue descending to Namche Bazaar. Enjoy the thicker air and warmer temperatures.",
        walkingTime: "6-7 hours",
        altitude: "3,440m",
        highlights: ["Rapid descent", "Thicker air relief", "Namche Bazaar amenities"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 10,
        title: "Trek to Lukla",
        description:
          "Final day of trekking. Descend through pine forests and Sherpa villages back to Lukla. Celebration dinner.",
        walkingTime: "6-7 hours",
        altitude: "2,840m",
        highlights: ["Trek completion", "Team celebration", "Reflection on achievement"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 11,
        title: "Fly back to Kathmandu",
        description: "Morning flight back to Kathmandu. Rest day in the capital with optional sightseeing or shopping.",
        walkingTime: "Flight day",
        altitude: "1,400m",
        highlights: ["Return flight", "Kathmandu arrival", "Hot shower and comfortable bed"],
        accommodation: "Hotel",
        meals: "Breakfast",
      },
    ],
  },
  {
    id: "6",
    slug: "upper-mustang",
    name: "Upper Mustang Trek",
    description:
      "Step into a hidden world with the Upper Mustang Trek, a journey to the ancient forbidden kingdom of Lo. This 14-day trek takes you through a stark, beautiful desert landscape, rich in Tibetan Buddhist culture and ancient monasteries. Explore walled cities, cave dwellings, and experience a unique way of life preserved for centuries.",
    price: 2500,
    duration: "14 days",
    difficulty: "Moderate",
    location: "Mustang Region, Nepal",
    rating: 4.7,
    reviews: 32,
    images: [
      "/images/upper-mustang.jpg",
      "/images/prayer-flags.jpg",
      "/images/sherpa-village.jpg",
      "/images/mountain-sunrise.jpg",
      "/images/annapurna-circuit.jpg",
    ],
    startDate: "2024-05-01",
    endDate: "2024-05-14",
    maxGroupSize: 8,
    minAge: 18,
    included: [
      "Licensed trekking guide",
      "All meals during trek",
      "Tea house accommodation",
      "Upper Mustang Restricted Area Permit",
      "ACAP permit",
      "Jeep transportation Jomsom-Lo Manthang-Jomsom",
      "First aid kit",
    ],
    guide: {
      name: "Tashi Bista",
      title: "Mustang Cultural Guide",
      bio: "Tashi is a native of Upper Mustang and has an intimate knowledge of its history, culture, and hidden trails. He is passionate about sharing the unique heritage of his homeland.",
      image: "/images/upper-mustang.jpg",
      experience: "10+ years",
      languages: ["English", "Nepali", "Tibetan", "Loke"],
    },
    routeHighlights: [
      {
        name: "Lo Manthang",
        description: "The ancient walled capital of Upper Mustang, a living museum of Tibetan culture and history.",
        importance: "high",
        image: "/images/upper-mustang.jpg",
      },
      {
        name: "Chhoser Cave",
        description:
          "Ancient multi-story cave dwellings carved into cliffs, offering a glimpse into early human settlements.",
        importance: "medium",
        image: "/images/prayer-flags.jpg",
      },
      {
        name: "Ghar Gompa",
        description:
          "One of the oldest monasteries in Tibet and Mustang, believed to have been built by Guru Rinpoche.",
        importance: "high",
        image: "/images/sherpa-village.jpg",
      },
      {
        name: "Red Cliffs of Dhakmar",
        description:
          "Stunning red sandstone cliffs, believed to be stained by the blood of a demon killed by Guru Rinpoche.",
        importance: "medium",
        image: "/images/mountain-sunrise.jpg",
      },
    ],
    detailedItinerary: [
      {
        day: 1,
        title: "Fly to Pokhara, Fly to Jomsom, Drive to Kagbeni",
        description:
          "Morning flight to Pokhara, then a connecting flight to Jomsom. From Jomsom, drive to Kagbeni, the gateway to Upper Mustang.",
        walkingTime: "Flight/Drive day",
        altitude: "2,800m",
        highlights: ["Scenic flights", "Kali Gandaki Gorge", "Kagbeni village"],
        accommodation: "Tea house",
        meals: "Lunch, Dinner",
      },
      {
        day: 2,
        title: "Trek to Chele",
        description:
          "Enter the restricted area of Upper Mustang. Trek along the Kali Gandaki riverbed and ascend to Chele.",
        walkingTime: "5-6 hours",
        altitude: "3,050m",
        highlights: ["Upper Mustang entry", "Kali Gandaki riverbed", "Traditional villages"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 3,
        title: "Trek to Syanbochen",
        description:
          "Cross several passes with stunning views of Nilgiri, Tilicho, and Annapurna. The landscape becomes more arid.",
        walkingTime: "6-7 hours",
        altitude: "3,475m",
        highlights: ["Mountain passes", "Arid landscape", "Annapurna views"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 4,
        title: "Trek to Ghami",
        description: "Descend to the village of Ghami, passing through traditional villages and ancient chortens.",
        walkingTime: "5-6 hours",
        altitude: "3,520m",
        highlights: ["Ancient chortens", "Traditional villages", "Ghami village"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 5,
        title: "Trek to Charang",
        description:
          "Cross the longest Mani wall in Mustang and trek to Charang, a large village with a monastery and a fortress.",
        walkingTime: "4-5 hours",
        altitude: "3,560m",
        highlights: ["Longest Mani wall", "Charang monastery", "Ancient fortress"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 6,
        title: "Trek to Lo Manthang",
        description: "The highlight of the trek! Trek to Lo Manthang, the ancient walled capital of Upper Mustang.",
        walkingTime: "4-5 hours",
        altitude: "3,840m",
        highlights: ["Lo Manthang arrival", "Walled city exploration", "Ancient palace"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 7,
        title: "Explore Lo Manthang",
        description:
          "Explore the fascinating walled city of Lo Manthang, visit monasteries, and the King's Palace. Optional horse riding.",
        walkingTime: "Exploration day",
        altitude: "3,840m",
        highlights: ["Monastery visits", "King's Palace", "Cultural immersion"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 8,
        title: "Excursion to Chhoser and Ghar Gompa",
        description:
          "Day trip to Chhoser to explore ancient cave dwellings and visit the sacred Ghar Gompa, one of the oldest monasteries.",
        walkingTime: "5-6 hours (jeep/walk)",
        altitude: "3,840m",
        highlights: ["Chhoser caves", "Ghar Gompa", "Ancient history"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 9,
        title: "Trek back to Ghami",
        description: "Begin the return journey, retracing your steps through the unique Mustang landscape.",
        walkingTime: "6-7 hours",
        altitude: "3,520m",
        highlights: ["Return journey", "Desert landscapes", "Reflection"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 10,
        title: "Trek back to Chhusang",
        description: "Continue descending through the arid landscape, enjoying different perspectives of the scenery.",
        walkingTime: "6-7 hours",
        altitude: "2,980m",
        highlights: ["Descent views", "Changing scenery", "Lower altitude"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 11,
        title: "Trek back to Jomsom",
        description: "Final day of trekking. Descend to Jomsom, where the trek officially ends.",
        walkingTime: "6-7 hours",
        altitude: "2,720m",
        highlights: ["Trek completion", "Jomsom town", "Celebration"],
        accommodation: "Tea house",
        meals: "Breakfast, Lunch, Dinner",
      },
      {
        day: 12,
        title: "Fly back to Pokhara",
        description: "Morning flight from Jomsom to Pokhara. Enjoy the lakeside city and relax after the trek.",
        walkingTime: "Flight day",
        altitude: "822m",
        highlights: ["Return flight", "Pokhara relaxation", "Lakeside activities"],
        accommodation: "Hotel",
        meals: "Breakfast",
      },
      {
        day: 13,
        title: "Drive/Fly to Kathmandu",
        description:
          "Drive or fly back to Kathmandu. Celebration dinner and reflection on the incredible journey completed.",
        walkingTime: "Travel day",
        altitude: "1,400m",
        highlights: ["Journey completion", "Celebration dinner", "Achievement reflection"],
        accommodation: "Hotel",
        meals: "Breakfast",
      },
    ],
  },
]
