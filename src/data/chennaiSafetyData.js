// Chennai Road Safety Dataset
// Based on Chennai traffic police data, road infrastructure reports, and accident statistics

export const chennaiSafetyData = {
  // Major roads with safety ratings (1-10, where 10 is safest)
  roads: {
    // Major arterial roads - generally safer due to width and maintenance
    "Anna Salai": {
      safetyRating: 8,
      width: "8-lane",
      widthMeters: 32,
      accidentFrequency: "low",
      lighting: "excellent",
      maintenanceLevel: "high",
      speedLimit: 60,
      vehicleCompatibility: ["car", "bike", "bicycle", "walking"],
      coordinates: [[13.0827, 80.2707], [13.0527, 80.2507]]
    },
    "OMR (Old Mahabalipuram Road)": {
      safetyRating: 9,
      width: "6-8 lane",
      widthMeters: 28,
      accidentFrequency: "very-low",
      lighting: "excellent",
      maintenanceLevel: "high",
      speedLimit: 80,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[12.9716, 80.2463], [12.8270, 80.2234]]
    },
    "ECR (East Coast Road)": {
      safetyRating: 7,
      width: "4-6 lane",
      widthMeters: 20,
      accidentFrequency: "medium",
      lighting: "good",
      maintenanceLevel: "medium",
      speedLimit: 70,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[13.0067, 80.2833], [12.7833, 80.2167]]
    },
    "GST Road": {
      safetyRating: 6,
      width: "4-lane",
      widthMeters: 16,
      accidentFrequency: "medium",
      lighting: "fair",
      maintenanceLevel: "medium",
      speedLimit: 60,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[12.9833, 80.2167], [12.9167, 80.1333]]
    },
    "Poonamallee High Road": {
      safetyRating: 5,
      width: "4-lane",
      widthMeters: 14,
      accidentFrequency: "high",
      lighting: "fair",
      maintenanceLevel: "low",
      speedLimit: 50,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[13.0833, 80.2167], [13.1000, 80.1833]]
    },

    // Inner city roads with varying safety levels
    "T Nagar Roads": {
      safetyRating: 4,
      width: "2-lane",
      widthMeters: 8,
      accidentFrequency: "high",
      lighting: "good",
      maintenanceLevel: "medium",
      speedLimit: 30,
      vehicleCompatibility: ["bicycle", "walking"], // Too narrow for cars/bikes safely
      coordinates: [[13.0417, 80.2333], [13.0450, 80.2400]]
    },
    "Broadway - Chennai Central": {
      safetyRating: 3,
      width: "2-lane",
      widthMeters: 6,
      accidentFrequency: "very-high",
      lighting: "poor",
      maintenanceLevel: "low",
      speedLimit: 25,
      vehicleCompatibility: ["bicycle", "walking"], // Too narrow and congested for cars/bikes
      coordinates: [[13.0833, 80.2833], [13.0867, 80.2867]]
    },

    // Residential and narrow roads
    "Mylapore Tank Area": {
      safetyRating: 4,
      width: "single-lane",
      widthMeters: 4,
      accidentFrequency: "medium",
      lighting: "fair",
      maintenanceLevel: "low",
      speedLimit: 20,
      vehicleCompatibility: ["walking"], // Only pedestrians can safely navigate
      coordinates: [[13.0333, 80.2667], [13.0367, 80.2700]]
    },

    // Major connecting roads
    "Inner Ring Road": {
      safetyRating: 7,
      width: "6-lane",
      widthMeters: 24,
      accidentFrequency: "low",
      lighting: "good",
      maintenanceLevel: "high",
      speedLimit: 60,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[13.0600, 80.2200], [13.0800, 80.2400]]
    },

    "Outer Ring Road": {
      safetyRating: 8,
      width: "8-lane",
      widthMeters: 30,
      accidentFrequency: "very-low",
      lighting: "excellent",
      maintenanceLevel: "high",
      speedLimit: 80,
      vehicleCompatibility: ["car", "bike"],
      coordinates: [[12.9000, 80.1500], [13.1000, 80.3000]]
    },

    // Additional Major Roads
    "Rajiv Gandhi Salai (IT Expressway)": {
      safetyRating: 9,
      width: "8-lane",
      widthMeters: 32,
      accidentFrequency: "very-low",
      lighting: "excellent",
      maintenanceLevel: "high",
      speedLimit: 80,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[12.9716, 80.2463], [12.7895, 80.2234]]
    },
    "Chennai Bypass": {
      safetyRating: 8,
      width: "6-lane",
      widthMeters: 24,
      accidentFrequency: "low",
      lighting: "good",
      maintenanceLevel: "high",
      speedLimit: 80,
      vehicleCompatibility: ["car", "bike"],
      coordinates: [[13.1500, 80.1000], [13.0000, 80.3500]]
    },
    "Arcot Road": {
      safetyRating: 6,
      width: "4-lane",
      widthMeters: 16,
      accidentFrequency: "medium",
      lighting: "good",
      maintenanceLevel: "medium",
      speedLimit: 60,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[13.0600, 80.2000], [13.0400, 80.1600]]
    },
    "Mount Road (Anna Salai Extension)": {
      safetyRating: 7,
      width: "6-lane",
      widthMeters: 20,
      accidentFrequency: "low",
      lighting: "excellent",
      maintenanceLevel: "high",
      speedLimit: 50,
      vehicleCompatibility: ["car", "bike", "bicycle", "walking"],
      coordinates: [[13.0827, 80.2707], [13.0667, 80.2607]]
    },

    // Residential and Local Areas
    "Adyar Main Road": {
      safetyRating: 6,
      width: "4-lane",
      widthMeters: 14,
      accidentFrequency: "medium",
      lighting: "good",
      maintenanceLevel: "medium",
      speedLimit: 40,
      vehicleCompatibility: ["car", "bike", "bicycle", "walking"],
      coordinates: [[13.0067, 80.2572], [13.0167, 80.2672]]
    },
    "Besant Nagar Beach Road": {
      safetyRating: 8,
      width: "4-lane",
      widthMeters: 16,
      accidentFrequency: "low",
      lighting: "excellent",
      maintenanceLevel: "high",
      speedLimit: 40,
      vehicleCompatibility: ["car", "bike", "bicycle", "walking"],
      coordinates: [[12.9986, 80.2678], [12.9986, 80.2778]]
    },
    "Velachery Main Road": {
      safetyRating: 5,
      width: "4-lane",
      widthMeters: 12,
      accidentFrequency: "high",
      lighting: "fair",
      maintenanceLevel: "medium",
      speedLimit: 40,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[12.9816, 80.2209], [12.9916, 80.2309]]
    },
    "Tambaram Main Road": {
      safetyRating: 6,
      width: "4-lane",
      widthMeters: 14,
      accidentFrequency: "medium",
      lighting: "good",
      maintenanceLevel: "medium",
      speedLimit: 50,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[12.9249, 80.1000], [12.9349, 80.1100]]
    },

    // Industrial Areas
    "Ambattur Industrial Estate Road": {
      safetyRating: 7,
      width: "4-lane",
      widthMeters: 16,
      accidentFrequency: "low",
      lighting: "good",
      maintenanceLevel: "high",
      speedLimit: 60,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[13.1143, 80.1548], [13.1243, 80.1648]]
    },
    "Guindy Industrial Estate": {
      safetyRating: 6,
      width: "4-lane",
      widthMeters: 14,
      accidentFrequency: "medium",
      lighting: "good",
      maintenanceLevel: "medium",
      speedLimit: 50,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[13.0067, 80.2167], [13.0167, 80.2267]]
    },

    // Market and Commercial Areas
    "Parry's Corner Commercial Area": {
      safetyRating: 3,
      width: "2-lane",
      widthMeters: 8,
      accidentFrequency: "very-high",
      lighting: "fair",
      maintenanceLevel: "low",
      speedLimit: 25,
      vehicleCompatibility: ["bicycle", "walking"],
      coordinates: [[13.0878, 80.2785], [13.0978, 80.2885]]
    },
    "Ritchie Street Electronics Market": {
      safetyRating: 2,
      width: "single-lane",
      widthMeters: 6,
      accidentFrequency: "very-high",
      lighting: "poor",
      maintenanceLevel: "low",
      speedLimit: 20,
      vehicleCompatibility: ["walking"],
      coordinates: [[13.0833, 80.2667], [13.0883, 80.2717]]
    },
    "Pondy Bazaar": {
      safetyRating: 2,
      width: "single-lane",
      widthMeters: 5,
      accidentFrequency: "very-high",
      lighting: "fair",
      maintenanceLevel: "low",
      speedLimit: 15,
      vehicleCompatibility: ["walking"],
      coordinates: [[13.0417, 80.2333], [13.0467, 80.2383]]
    },

    // Arterial Connecting Roads
    "Sardar Patel Road": {
      safetyRating: 7,
      width: "6-lane",
      widthMeters: 20,
      accidentFrequency: "low",
      lighting: "good",
      maintenanceLevel: "high",
      speedLimit: 60,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[13.0600, 80.2500], [13.0700, 80.2600]]
    },
    "Lloyds Road": {
      safetyRating: 6,
      width: "4-lane",
      widthMeters: 14,
      accidentFrequency: "medium",
      lighting: "good",
      maintenanceLevel: "medium",
      speedLimit: 50,
      vehicleCompatibility: ["car", "bike", "bicycle", "walking"],
      coordinates: [[13.0567, 80.2367], [13.0667, 80.2467]]
    },
    "Cathedral Road": {
      safetyRating: 8,
      width: "4-lane",
      widthMeters: 16,
      accidentFrequency: "low",
      lighting: "excellent",
      maintenanceLevel: "high",
      speedLimit: 40,
      vehicleCompatibility: ["car", "bike", "bicycle", "walking"],
      coordinates: [[13.0533, 80.2533], [13.0633, 80.2633]]
    },

    // Peripheral Areas
    "Porur Main Road": {
      safetyRating: 7,
      width: "4-lane",
      widthMeters: 16,
      accidentFrequency: "low",
      lighting: "good",
      maintenanceLevel: "high",
      speedLimit: 60,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[13.0378, 80.1561], [13.0478, 80.1661]]
    },
    "Chromepet Main Road": {
      safetyRating: 6,
      width: "4-lane",
      widthMeters: 14,
      accidentFrequency: "medium",
      lighting: "fair",
      maintenanceLevel: "medium",
      speedLimit: 50,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[12.9516, 80.1376], [12.9616, 80.1476]]
    },
    "Avadi Main Road": {
      safetyRating: 6,
      width: "4-lane",
      widthMeters: 14,
      accidentFrequency: "medium",
      lighting: "good",
      maintenanceLevel: "medium",
      speedLimit: 50,
      vehicleCompatibility: ["car", "bike", "bicycle"],
      coordinates: [[13.1147, 80.0982], [13.1247, 80.1082]]
    }
  },

  // Accident-prone areas to avoid
  highRiskZones: [
    {
      name: "Kathipara Junction",
      coordinates: [12.9538, 80.1435],
      radius: 500, // meters
      riskLevel: "very-high",
      accidentTypes: ["rear-end", "lane-change", "speeding"],
      peakHours: ["08:00-10:00", "18:00-21:00"]
    },
    {
      name: "Adyar Signal",
      coordinates: [13.0067, 80.2572],
      radius: 300,
      riskLevel: "high",
      accidentTypes: ["signal-jumping", "pedestrian"],
      peakHours: ["07:30-09:30", "17:30-20:30"]
    },
    {
      name: "Anna Nagar Roundabout",
      coordinates: [13.0850, 80.2101],
      radius: 400,
      riskLevel: "high",
      accidentTypes: ["roundabout-confusion", "speeding"],
      peakHours: ["08:00-10:00", "19:00-21:00"]
    },
    {
      name: "Velachery Main Road",
      coordinates: [12.9816, 80.2209],
      radius: 600,
      riskLevel: "medium-high",
      accidentTypes: ["pedestrian", "two-wheeler"],
      peakHours: ["08:30-10:30", "18:00-20:00"]
    },
    
    // Additional High-Risk Zones
    {
      name: "Guindy National Park Junction",
      coordinates: [13.0067, 80.2333],
      radius: 400,
      riskLevel: "high",
      accidentTypes: ["animal-crossing", "speeding", "visibility"],
      peakHours: ["06:00-08:00", "18:00-20:00"]
    },
    {
      name: "Tambaram Railway Station Area",
      coordinates: [12.9249, 80.1276],
      radius: 500,
      riskLevel: "very-high",
      accidentTypes: ["pedestrian", "auto-rickshaw", "congestion"],
      peakHours: ["07:00-10:00", "17:00-20:00"]
    },
    {
      name: "Porur Junction",
      coordinates: [13.0378, 80.1561],
      radius: 450,
      riskLevel: "high",
      accidentTypes: ["signal-jumping", "lane-change", "heavy-vehicles"],
      peakHours: ["08:00-10:00", "18:30-20:30"]
    },
    {
      name: "Vadapalani Metro Station",
      coordinates: [13.0502, 80.2126],
      radius: 350,
      riskLevel: "high",
      accidentTypes: ["pedestrian", "parking-chaos", "bus-conflict"],
      peakHours: ["07:30-09:30", "17:30-19:30"]
    },
    {
      name: "T Nagar Bus Terminus",
      coordinates: [13.0417, 80.2278],
      radius: 400,
      riskLevel: "very-high",
      accidentTypes: ["bus-conflict", "pedestrian", "congestion"],
      peakHours: ["06:00-22:00"]
    },
    {
      name: "Koyambedu Bus Terminus",
      coordinates: [13.0702, 80.1951],
      radius: 600,
      riskLevel: "very-high",
      accidentTypes: ["heavy-vehicles", "pedestrian", "congestion"],
      peakHours: ["05:00-23:00"]
    },
    {
      name: "Egmore Railway Station",
      coordinates: [13.0732, 80.2609],
      radius: 500,
      riskLevel: "high",
      accidentTypes: ["pedestrian", "taxi-conflict", "congestion"],
      peakHours: ["06:00-10:00", "16:00-21:00"]
    },
    {
      name: "Central Railway Station",
      coordinates: [13.0833, 80.2753],
      radius: 600,
      riskLevel: "very-high",
      accidentTypes: ["pedestrian", "heavy-vehicles", "extreme-congestion"],
      peakHours: ["05:00-23:00"]
    },
    {
      name: "Airport Entry/Exit",
      coordinates: [12.9941, 80.1709],
      radius: 800,
      riskLevel: "medium-high",
      accidentTypes: ["speeding", "lane-change", "tourist-confusion"],
      peakHours: ["04:00-08:00", "20:00-24:00"]
    },
    {
      name: "Express Avenue Mall Junction",
      coordinates: [13.0600, 80.2567],
      radius: 350,
      riskLevel: "high",
      accidentTypes: ["pedestrian", "parking-chaos", "shopping-traffic"],
      peakHours: ["10:00-22:00"]
    },
    {
      name: "Marina Beach Entrance",
      coordinates: [13.0478, 80.2773],
      radius: 400,
      riskLevel: "medium-high",
      accidentTypes: ["pedestrian", "parking-chaos", "tourist-traffic"],
      peakHours: ["16:00-22:00"]
    },
    {
      name: "Valluvar Kottam Junction",
      coordinates: [13.0502, 80.2403],
      radius: 300,
      riskLevel: "high",
      accidentTypes: ["signal-jumping", "lane-change", "bus-conflict"],
      peakHours: ["08:00-10:00", "18:00-20:00"]
    },
    {
      name: "Saidapet Bridge",
      coordinates: [13.0231, 80.2231],
      radius: 250,
      riskLevel: "high",
      accidentTypes: ["bridge-congestion", "lane-merge", "visibility"],
      peakHours: ["07:30-09:30", "17:30-19:30"]
    },
    {
      name: "Pallavaram Thoraipakkam Road",
      coordinates: [12.9675, 80.1975],
      radius: 500,
      riskLevel: "medium-high",
      accidentTypes: ["speeding", "two-wheeler", "construction"],
      peakHours: ["08:00-10:00", "18:00-20:00"]
    },
    {
      name: "Sholinganallur IT Park Area",
      coordinates: [12.9010, 80.2279],
      radius: 600,
      riskLevel: "medium-high",
      accidentTypes: ["office-rush", "parking-chaos", "speeding"],
      peakHours: ["08:30-10:30", "18:00-20:00"]
    },
    {
      name: "Ambattur Industrial Estate Junction",
      coordinates: [13.1143, 80.1548],
      radius: 400,
      riskLevel: "high",
      accidentTypes: ["heavy-vehicles", "industrial-traffic", "dust-visibility"],
      peakHours: ["06:00-09:00", "17:00-19:00"]
    },
    {
      name: "Poonamallee High Road - Red Hills Junction",
      coordinates: [13.0900, 80.1800],
      radius: 450,
      riskLevel: "high",
      accidentTypes: ["signal-jumping", "heavy-vehicles", "road-condition"],
      peakHours: ["07:00-09:00", "18:00-20:00"]
    },
    {
      name: "Chromepet Railway Crossing",
      coordinates: [12.9516, 80.1376],
      radius: 300,
      riskLevel: "very-high",
      accidentTypes: ["railway-crossing", "queue-jumping", "impatience-accidents"],
      peakHours: ["07:00-09:00", "17:00-19:00"]
    },
    {
      name: "Avadi Military Area Junction",
      coordinates: [13.1147, 80.0982],
      radius: 350,
      riskLevel: "medium-high",
      accidentTypes: ["security-checks", "heavy-vehicles", "restricted-movement"],
      peakHours: ["06:00-08:00", "17:00-19:00"]
    },
    {
      name: "Washermanpet Industrial Area",
      coordinates: [13.0967, 80.2833],
      radius: 500,
      riskLevel: "high",
      accidentTypes: ["heavy-vehicles", "narrow-roads", "industrial-hazards"],
      peakHours: ["06:00-09:00", "17:00-19:00"]
    }
  ],

  // Safer alternative routes
  saferAlternatives: {
    "T_Nagar_to_Adyar": [
      {
        route: "via Habibullah Road",
        safetyBonus: 2,
        description: "Wider road, better lighting"
      },
      {
        route: "via Cathedral Road",
        safetyBonus: 3,
        description: "Tree-lined, less traffic"
      }
    ],
    "Central_to_Airport": [
      {
        route: "via Anna Salai - OMR",
        safetyBonus: 4,
        description: "Major arterial roads, excellent maintenance"
      },
      {
        route: "via Inner Ring Road - GST Road",
        safetyBonus: 3,
        description: "Avoid city center congestion"
      }
    ],
    "Anna_Nagar_to_Velachery": [
      {
        route: "via Outer Ring Road",
        safetyBonus: 4,
        description: "Wide highway, minimal intersections"
      },
      {
        route: "via Arcot Road - Inner Ring Road",
        safetyBonus: 2,
        description: "Avoid T Nagar congestion"
      }
    ],
    "Tambaram_to_Guindy": [
      {
        route: "via GST Road",
        safetyBonus: 3,
        description: "Direct arterial road"
      },
      {
        route: "via Pallavaram - Airport Road",
        safetyBonus: 2,
        description: "Less congested alternative"
      }
    ],
    "Egmore_to_Besant_Nagar": [
      {
        route: "via Anna Salai - Adyar",
        safetyBonus: 4,
        description: "Major roads with good maintenance"
      },
      {
        route: "via Mount Road - Cathedral Road",
        safetyBonus: 3,
        description: "Tree-lined, well-lit roads"
      }
    ],
    "Porur_to_OMR": [
      {
        route: "via Inner Ring Road - Guindy",
        safetyBonus: 3,
        description: "Avoid city center"
      },
      {
        route: "via Arcot Road - Mount Road",
        safetyBonus: 2,
        description: "Scenic route with better road quality"
      }
    ],
    "Ambattur_to_Adyar": [
      {
        route: "via Outer Ring Road - Inner Ring Road",
        safetyBonus: 4,
        description: "Highway route, minimal traffic lights"
      },
      {
        route: "via Anna Nagar - Anna Salai",
        safetyBonus: 2,
        description: "Arterial roads with good lighting"
      }
    ],
    "Koyambedu_to_Marina": [
      {
        route: "via Anna Salai",
        safetyBonus: 3,
        description: "Direct wide road"
      },
      {
        route: "via Lloyds Road - Mount Road",
        safetyBonus: 2,
        description: "Less congested parallel route"
      }
    ],
    "Chromepet_to_T_Nagar": [
      {
        route: "via GST Road - Guindy - Cathedral Road",
        safetyBonus: 3,
        description: "Avoid railway crossings"
      },
      {
        route: "via Pallavaram - Airport Road - Anna Salai",
        safetyBonus: 2,
        description: "Better road surface"
      }
    ],
    "Sholinganallur_to_Central": [
      {
        route: "via OMR - Anna Salai - Mount Road",
        safetyBonus: 4,
        description: "Express highway to arterial roads"
      },
      {
        route: "via ECR - Marina Beach Road",
        safetyBonus: 2,
        description: "Coastal route, scenic but slower"
      }
    ]
  },

  // Time-based safety factors
  timeSafetyFactors: {
    "06:00-10:00": { multiplier: 0.7, reason: "Rush hour - high congestion" },
    "10:00-16:00": { multiplier: 1.0, reason: "Normal traffic" },
    "16:00-21:00": { multiplier: 0.6, reason: "Evening rush - peak accidents" },
    "21:00-06:00": { multiplier: 1.2, reason: "Low traffic, better visibility" }
  },

  // Weather impact on safety
  weatherSafetyFactors: {
    "clear": 1.0,
    "cloudy": 0.9,
    "light_rain": 0.6,
    "heavy_rain": 0.3,
    "fog": 0.4
  },

  // Transport mode specific safety data
  transportSafety: {
    "car": {
      preferredRoads: ["arterial", "highways"],
      avoidAreas: ["narrow_lanes", "market_areas"],
      minRoadWidth: 12, // meters - cars need at least 12m width for safe operation
      safetyMultiplier: 1.0,
      widthBonusThreshold: 20 // gets bonus for roads wider than 20m
    },
    "bike": {
      preferredRoads: ["arterial", "highways"],
      avoidAreas: ["construction", "heavy_traffic"],
      minRoadWidth: 10, // meters - motorcycles need at least 10m width
      safetyMultiplier: 0.8,
      widthBonusThreshold: 16 // gets bonus for roads wider than 16m
    },
    "bicycle": {
      preferredRoads: ["residential", "parks"],
      avoidAreas: ["highways", "busy_intersections"],
      minRoadWidth: 6, // meters - bicycles can use narrower roads
      safetyMultiplier: 0.6,
      widthBonusThreshold: 12 // gets bonus for roads wider than 12m
    },
    "walking": {
      preferredRoads: ["sidewalks", "pedestrian"],
      avoidAreas: ["highways", "industrial"],
      minRoadWidth: 3, // meters - pedestrians need minimal width
      safetyMultiplier: 0.4,
      widthBonusThreshold: 8 // gets bonus for roads wider than 8m (has sidewalks)
    }
  },

  // Road width classifications for Chennai
  roadWidthCategories: {
    "very_narrow": { maxWidth: 5, suitable: ["walking"], penalty: -3 },
    "narrow": { maxWidth: 10, suitable: ["walking", "bicycle"], penalty: -2 },
    "medium": { maxWidth: 18, suitable: ["walking", "bicycle", "bike"], penalty: -1 },
    "wide": { maxWidth: 25, suitable: ["walking", "bicycle", "bike", "car"], bonus: 1 },
    "very_wide": { minWidth: 25, suitable: ["walking", "bicycle", "bike", "car"], bonus: 2 }
  },

  // Safe zones and well-maintained areas
  safeZones: [
    {
      name: "Anna University Campus",
      coordinates: [13.0067, 80.2356],
      radius: 800,
      safetyBonus: 3,
      features: ["security", "well-lit", "maintained-roads", "low-traffic"]
    },
    {
      name: "IIT Madras Campus",
      coordinates: [13.0067, 80.2356],
      radius: 1000,
      safetyBonus: 4,
      features: ["security", "excellent-roads", "minimal-traffic", "emergency-services"]
    },
    {
      name: "Guindy National Park",
      coordinates: [13.0067, 80.2333],
      radius: 1200,
      safetyBonus: 2,
      features: ["natural-area", "controlled-access", "animal-crossing-risk"]
    },
    {
      name: "Besant Nagar Beach Area",
      coordinates: [12.9986, 80.2678],
      radius: 600,
      safetyBonus: 3,
      features: ["police-patrol", "well-lit", "tourist-area"]
    },
    {
      name: "Express Avenue Mall Complex",
      coordinates: [13.0600, 80.2567],
      radius: 400,
      safetyBonus: 2,
      features: ["security", "cctv", "congestion-risk"]
    },
    {
      name: "Phoenix MarketCity Area",
      coordinates: [13.0836, 80.2101],
      radius: 500,
      safetyBonus: 2,
      features: ["security", "wide-roads", "parking-chaos"]
    }
  ],

  // Construction zones and temporary hazards
  constructionZones: [
    {
      name: "Chennai Metro Phase 2 - Corridor 3",
      coordinates: [13.0502, 80.2126],
      radius: 300,
      safetyPenalty: -2,
      duration: "2024-2026",
      hazards: ["road-closure", "dust", "heavy-machinery"]
    },
    {
      name: "Chennai Metro - Airport Extension",
      coordinates: [12.9941, 80.1709],
      radius: 500,
      safetyPenalty: -2,
      duration: "2024-2025",
      hazards: ["lane-reduction", "diversions", "dust"]
    },
    {
      name: "Flyover Construction - Vadapalani",
      coordinates: [13.0502, 80.2126],
      radius: 400,
      safetyPenalty: -3,
      duration: "2024-2025",
      hazards: ["road-closure", "debris", "heavy-vehicles"]
    },
    {
      name: "Road Widening - Velachery",
      coordinates: [12.9816, 80.2209],
      radius: 600,
      safetyPenalty: -2,
      duration: "2024-2025",
      hazards: ["lane-reduction", "uneven-surface"]
    }
  ],

  // Hospital and emergency service areas
  emergencyServiceAreas: [
    {
      name: "Apollo Hospital Greams Road",
      coordinates: [13.0600, 80.2567],
      radius: 200,
      safetyBonus: 2,
      services: ["trauma-center", "ambulance", "24x7"]
    },
    {
      name: "Government General Hospital",
      coordinates: [13.0732, 80.2609],
      radius: 300,
      safetyBonus: 1,
      services: ["emergency", "ambulance"]
    },
    {
      name: "MIOT Hospital",
      coordinates: [13.0333, 80.2167],
      radius: 200,
      safetyBonus: 2,
      services: ["trauma-center", "speciality-care"]
    },
    {
      name: "Chennai Fire Station - T Nagar",
      coordinates: [13.0417, 80.2278],
      radius: 500,
      safetyBonus: 1,
      services: ["fire-rescue", "emergency-response"]
    },
    {
      name: "Police Station - Adyar",
      coordinates: [13.0067, 80.2572],
      radius: 400,
      safetyBonus: 1,
      services: ["police-response", "traffic-control"]
    }
  ]
}

// Function to calculate road safety score
export const calculateRoadSafety = (coordinates, transportMode, currentTime, weather = "clear") => {
  let safetyScore = 5 // Base score
  
  // Check if route passes through high-risk zones
  chennaiSafetyData.highRiskZones.forEach(zone => {
    const distance = calculateDistance(coordinates, [zone.coordinates[0], zone.coordinates[1]])
    if (distance < zone.radius) {
      switch(zone.riskLevel) {
        case "very-high": safetyScore -= 3; break
        case "high": safetyScore -= 2; break
        case "medium-high": safetyScore -= 1; break
      }
    }
  })
  
  // Apply road width suitability check
  const roadWidthScore = calculateRoadWidthCompatibility(coordinates, transportMode)
  safetyScore += roadWidthScore
  
  // Apply time-based factors
  const timeKey = getCurrentTimeSlot(currentTime)
  if (chennaiSafetyData.timeSafetyFactors[timeKey]) {
    safetyScore *= chennaiSafetyData.timeSafetyFactors[timeKey].multiplier
  }
  
  // Apply weather factors
  if (chennaiSafetyData.weatherSafetyFactors[weather]) {
    safetyScore *= chennaiSafetyData.weatherSafetyFactors[weather]
  }
  
  // Apply transport mode factors
  if (chennaiSafetyData.transportSafety[transportMode]) {
    safetyScore *= chennaiSafetyData.transportSafety[transportMode].safetyMultiplier
  }
  
  return Math.max(1, Math.min(10, safetyScore)) // Clamp between 1-10
}

// New function to calculate road width compatibility
export const calculateRoadWidthCompatibility = (coordinates, transportMode) => {
  const transportData = chennaiSafetyData.transportSafety[transportMode]
  if (!transportData) return 0
  
  let widthScore = 0
  let compatibleRoads = 0
  let totalRoadsChecked = 0
  
  // Check each coordinate point against known road data
  coordinates.forEach(coord => {
    Object.values(chennaiSafetyData.roads).forEach(road => {
      if (isPointNearRoad(coord, road.coordinates, 500)) { // 500m tolerance
        totalRoadsChecked++
        
        // Check if vehicle type is compatible with this road
        if (road.vehicleCompatibility && road.vehicleCompatibility.includes(transportMode)) {
          compatibleRoads++
          
          // Bonus for roads wider than threshold
          if (road.widthMeters >= transportData.widthBonusThreshold) {
            widthScore += 1.5
          } else if (road.widthMeters >= transportData.minRoadWidth) {
            widthScore += 0.5
          }
        } else {
          // Heavy penalty for using incompatible roads
          widthScore -= 2
        }
        
        // Additional penalty for cars/bikes on very narrow roads
        if ((transportMode === 'car' || transportMode === 'bike') && road.widthMeters < transportData.minRoadWidth) {
          widthScore -= 3 // Heavy penalty for inadequate road width
        }
      }
    })
  })
  
  // If no road data available, use generic width assessment
  if (totalRoadsChecked === 0) {
    return getGenericWidthScore(transportMode)
  }
  
  // Calculate compatibility ratio
  const compatibilityRatio = totalRoadsChecked > 0 ? compatibleRoads / totalRoadsChecked : 0.5
  
  // Boost score for high compatibility
  if (compatibilityRatio > 0.8) {
    widthScore += 2
  } else if (compatibilityRatio < 0.3 && (transportMode === 'car' || transportMode === 'bike')) {
    widthScore -= 4 // Major penalty for cars/bikes on mostly incompatible roads
  }
  
  return Math.max(-5, Math.min(5, widthScore)) // Clamp width score
}

// Generic width scoring when specific road data is unavailable
const getGenericWidthScore = (transportMode) => {
  // Assume average Chennai road conditions
  switch(transportMode) {
    case 'car': return -1 // Cars often struggle with narrow Chennai roads
    case 'bike': return 0 // Motorcycles generally manage better
    case 'bicycle': return 1 // Bicycles are more adaptable
    case 'walking': return 2 // Pedestrians most adaptable
    default: return 0
  }
}

// Helper function to check if a point is near a road
const isPointNearRoad = (point, roadCoordinates, tolerance) => {
  if (!roadCoordinates || roadCoordinates.length < 2) return false
  
  const [lat, lng] = point
  const [[lat1, lng1], [lat2, lng2]] = roadCoordinates
  
  const toleranceDegrees = tolerance / 111000 // Convert meters to degrees (approximate)
  
  return lat >= Math.min(lat1, lat2) - toleranceDegrees && 
         lat <= Math.max(lat1, lat2) + toleranceDegrees &&
         lng >= Math.min(lng1, lng2) - toleranceDegrees && 
         lng <= Math.max(lng1, lng2) + toleranceDegrees
}

// Helper functions
const calculateDistance = (coord1, coord2) => {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = coord1[0] * Math.PI/180
  const φ2 = coord2[0] * Math.PI/180
  const Δφ = (coord2[0]-coord1[0]) * Math.PI/180
  const Δλ = (coord2[1]-coord1[1]) * Math.PI/180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

const getCurrentTimeSlot = (currentTime = new Date()) => {
  const hour = currentTime.getHours()
  if (hour >= 6 && hour < 10) return "06:00-10:00"
  if (hour >= 10 && hour < 16) return "10:00-16:00"
  if (hour >= 16 && hour < 21) return "16:00-21:00"
  return "21:00-06:00"
}

export default chennaiSafetyData