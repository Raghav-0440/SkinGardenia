
export interface Plant {
  id: string;
  name: string;
  image: string;
  family: string;
  familyLatin: string;
  genus: string;
  size: string;
  detailedInfo: {
    size: string;
    nativeRegion: string;
    climate: string;
    sunlight: string;
    soil: string;
  };
  medicinalParts: string[];
  compounds: string[];
  therapeuticProperties: string[];
  dosageForms: string[];
}

export const plantData: Plant[] = [
  {
    id: "holy-basil",
    name: "Holy Basil",
    image: "https://images.unsplash.com/photo-1592489261331-945738b0587b?q=80&w=500&auto=format&fit=crop",
    family: "Mint",
    familyLatin: "Lamiaceae",
    genus: "Ocimum",
    size: "60 cm",
    detailedInfo: {
      size: "Grows up to 60 cm (2 feet) in height.",
      nativeRegion: "India and Southeast Asia.",
      climate: "Tropical and subtropical climates with well-drained soil.",
      sunlight: "Full sun to partial shade.",
      soil: "Well-drained, loamy or sandy soil."
    },
    medicinalParts: ["Leaves", "Flowers", "Seeds"],
    compounds: ["Eugenol", "Ursolic acid", "Rosmarinic acid", "Oleanolic acid"],
    therapeuticProperties: ["Antimicrobial", "Anti-inflammatory", "Adaptogenic", "Immunomodulatory"],
    dosageForms: ["Powder", "Oil", "Tea", "Tincture"]
  },
  {
    id: "aloe-vera",
    name: "Aloe Vera",
    image: "https://images.unsplash.com/photo-1596224237476-9f63fc7c6f5f?q=80&w=500&auto=format&fit=crop",
    family: "Aloe",
    familyLatin: "Asphodelaceae",
    genus: "Aloe",
    size: "100 cm",
    detailedInfo: {
      size: "Grows up to 100 cm (3.3 feet) in height.",
      nativeRegion: "Arabian Peninsula.",
      climate: "Arid to semi-arid regions.",
      sunlight: "Bright, indirect sunlight.",
      soil: "Sandy or rocky, well-draining soil."
    },
    medicinalParts: ["Gel", "Latex"],
    compounds: ["Aloin", "Emodin", "Acemannan", "Saponins"],
    therapeuticProperties: ["Anti-inflammatory", "Moisturizing", "Healing", "Antimicrobial"],
    dosageForms: ["Gel", "Juice", "Cream", "Ointment"]
  },
  {
    id: "neem",
    name: "Neem",
    image: "https://images.unsplash.com/photo-1591887076848-cbb93eb3d3d9?q=80&w=500&auto=format&fit=crop",
    family: "Mahogany",
    familyLatin: "Meliaceae",
    genus: "Azadirachta",
    size: "20 meters",
    detailedInfo: {
      size: "Grows up to 30 meters (100 feet) in height.",
      nativeRegion: "India, Sri Lanka, and Southeast Asia.",
      climate: "Tropical and subtropical climates with well-drained soil.",
      sunlight: "Full sun to partial shade.",
      soil: "Well-drained, loamy or sandy soil."
    },
    medicinalParts: ["Leaves", "Bark", "Seeds", "Oil"],
    compounds: ["Azadirachtin", "Nimbin", "Nimbidin", "Quercetin"],
    therapeuticProperties: ["Antimicrobial", "Anti-inflammatory", "Antioxidant", "Immunomodulatory"],
    dosageForms: ["Oil", "Powder", "Extract", "Paste"]
  },
  {
    id: "garlic",
    name: "Garlic",
    image: "https://images.unsplash.com/photo-1615477550927-953d2c57da0f?q=80&w=500&auto=format&fit=crop",
    family: "Onion",
    familyLatin: "Amaryllidaceae",
    genus: "Allium",
    size: "90 cm",
    detailedInfo: {
      size: "Grows up to 90 cm (3 feet) in height.",
      nativeRegion: "Central Asia and northeastern Iran.",
      climate: "Temperate climates.",
      sunlight: "Full sun.",
      soil: "Rich, well-drained soil."
    },
    medicinalParts: ["Bulb", "Cloves"],
    compounds: ["Allicin", "Ajoene", "Diallyl sulfide", "Saponins"],
    therapeuticProperties: ["Antimicrobial", "Immunomodulatory", "Antioxidant", "Cardiovascular support"],
    dosageForms: ["Capsules", "Oil", "Powder", "Extract"]
  }
];
