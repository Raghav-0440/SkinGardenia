export interface HomeRemedy {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  benefits: string[];
  image: string;
  category: string[];
}

export const homeRemedies: HomeRemedy[] = [
  {
    id: 1,
    name: "Rose Water and Aloe Vera Mask",
    description: "A soothing and hydrating face mask that helps calm irritated skin and provides deep hydration.",
    ingredients: [
      "2 tablespoons fresh aloe vera gel",
      "1 tablespoon rose water",
      "1 teaspoon honey (optional)"
    ],
    instructions: [
      "Mix aloe vera gel and rose water in a bowl",
      "Add honey if using and mix well",
      "Apply evenly to clean face",
      "Leave on for 15-20 minutes",
      "Rinse with cool water"
    ],
    benefits: [
      "Soothes irritated skin",
      "Provides deep hydration",
      "Reduces redness and inflammation",
      "Balances skin pH"
    ],
    image: "/images/home remedies/Rose-Water-and-Aloe-Vera-Mask.webp",
    category: ["Hydration", "Soothing", "Anti-inflammatory"]
  },
  {
    id: 2,
    name: "Cucumber and Mint Face Mask",
    description: "A refreshing face mask that helps cool and brighten the skin while reducing puffiness.",
    ingredients: [
      "1/2 cucumber",
      "5-6 fresh mint leaves",
      "1 tablespoon yogurt"
    ],
    instructions: [
      "Blend cucumber and mint leaves to form a smooth paste",
      "Mix in yogurt",
      "Apply to clean face",
      "Leave on for 15 minutes",
      "Rinse with cool water"
    ],
    benefits: [
      "Cools and refreshes skin",
      "Reduces puffiness",
      "Brightens complexion",
      "Tightens pores"
    ],
    image: "/images/home remedies/Cucumber-and-Mint-Face-Mask.jpeg",
    category: ["Brightening", "Cooling", "Pore Care"]
  },
  {
    id: 3,
    name: "Neem and Turmeric Face Pack",
    description: "An antibacterial and anti-inflammatory face pack that helps treat acne and blemishes.",
    ingredients: [
      "1 tablespoon neem powder",
      "1/2 teaspoon turmeric powder",
      "1 tablespoon honey",
      "1 tablespoon rose water"
    ],
    instructions: [
      "Mix all ingredients to form a smooth paste",
      "Apply to clean face",
      "Leave on for 15-20 minutes",
      "Rinse with lukewarm water"
    ],
    benefits: [
      "Treats acne and blemishes",
      "Reduces inflammation",
      "Controls oil production",
      "Prevents breakouts"
    ],
    image: "/images/home remedies/Neem-and-Turmeric-Face-Pack.jpeg",
    category: ["Acne Treatment", "Anti-inflammatory", "Oil Control"]
  },
  {
    id: 4,
    name: "Green Tea and Honey Mask",
    description: "An antioxidant-rich face mask that helps fight signs of aging and brightens the skin.",
    ingredients: [
      "1 tablespoon green tea leaves",
      "1 tablespoon honey",
      "1 teaspoon lemon juice"
    ],
    instructions: [
      "Brew green tea and let it cool",
      "Mix with honey and lemon juice",
      "Apply to clean face",
      "Leave on for 15 minutes",
      "Rinse with cool water"
    ],
    benefits: [
      "Fights signs of aging",
      "Brightens skin tone",
      "Reduces dark spots",
      "Provides antioxidant protection"
    ],
    image: "/images/home remedies/Green-Tea-and-Honey-Mask.jpeg",
    category: ["Anti-aging", "Brightening", "Antioxidant"]
  },
  {
    id: 5,
    name: "Turmeric and Milk Face Pack",
    description: "A traditional face pack that helps brighten skin and reduce pigmentation.",
    ingredients: [
      "1 teaspoon turmeric powder",
      "2 tablespoons milk",
      "1 teaspoon honey"
    ],
    instructions: [
      "Mix turmeric powder with milk",
      "Add honey and mix well",
      "Apply to clean face",
      "Leave on for 15 minutes",
      "Rinse with lukewarm water"
    ],
    benefits: [
      "Brightens skin tone",
      "Reduces pigmentation",
      "Improves skin texture",
      "Provides natural glow"
    ],
    image: "/images/home remedies/Turmeric-and-Milk-Face-Pack.jpg",
    category: ["Brightening", "Pigmentation", "Glow"]
  },
  {
    id: 6,
    name: "Honey Aloe Face Mask",
    description: "A nourishing face mask that helps moisturize and heal the skin.",
    ingredients: [
      "2 tablespoons aloe vera gel",
      "1 tablespoon honey",
      "1 teaspoon olive oil"
    ],
    instructions: [
      "Mix all ingredients well",
      "Apply to clean face",
      "Leave on for 15-20 minutes",
      "Rinse with lukewarm water"
    ],
    benefits: [
      "Deeply moisturizes skin",
      "Promotes healing",
      "Soothes irritation",
      "Improves skin elasticity"
    ],
    image: "/images/home remedies/Honey-Aloe-Face-Mask.jpeg",
    category: ["Moisturizing", "Healing", "Nourishing"]
  },
  {
    id: 7,
    name: "Rice Water Toner",
    description: "A natural toner that helps brighten skin and improve skin texture.",
    ingredients: [
      "1/2 cup rice",
      "2 cups water"
    ],
    instructions: [
      "Wash rice thoroughly",
      "Soak rice in water for 30 minutes",
      "Strain and collect the water",
      "Store in a clean bottle",
      "Apply with cotton pad after cleansing"
    ],
    benefits: [
      "Brightens skin tone",
      "Improves skin texture",
      "Reduces pores",
      "Balances skin pH"
    ],
    image: "/images/home remedies/Rice-Water-Toner.jpg",
    category: ["Toner", "Brightening", "Texture"]
  },
  {
    id: 8,
    name: "Papaya and Honey Face Pack",
    description: "An exfoliating and brightening face pack that helps remove dead skin cells.",
    ingredients: [
      "1/2 cup ripe papaya",
      "1 tablespoon honey",
      "1 teaspoon lemon juice"
    ],
    instructions: [
      "Mash papaya to form a smooth paste",
      "Add honey and lemon juice",
      "Apply to clean face",
      "Leave on for 15 minutes",
      "Rinse with lukewarm water"
    ],
    benefits: [
      "Exfoliates dead skin cells",
      "Brightens complexion",
      "Reduces pigmentation",
      "Improves skin texture"
    ],
    image: "/images/home remedies/Papaya-and-Honey-Face-Pack.webp",
    category: ["Exfoliation", "Brightening", "Texture"]
  },
  {
    id: 9,
    name: "Aloe Vera Gel with Rose Water",
    description: "A soothing and hydrating combination that helps calm and refresh the skin.",
    ingredients: [
      "2 tablespoons fresh aloe vera gel",
      "1 tablespoon rose water"
    ],
    instructions: [
      "Mix aloe vera gel and rose water",
      "Apply to clean face",
      "Leave on for 15 minutes",
      "Rinse with cool water"
    ],
    benefits: [
      "Soothes irritated skin",
      "Provides hydration",
      "Reduces redness",
      "Refreshes skin"
    ],
    image: "/images/home remedies/Aloe-Vera-Gel-with-Rose-Water.jpg",
    category: ["Soothing", "Hydration", "Refreshing"]
  },
  {
    id: 10,
    name: "Coconut Lemon Body Scrub",
    description: "A nourishing body scrub that helps exfoliate and moisturize the skin.",
    ingredients: [
      "1/2 cup coconut oil",
      "1/2 cup sugar",
      "1 tablespoon lemon juice"
    ],
    instructions: [
      "Mix all ingredients well",
      "Apply to damp skin",
      "Gently massage in circular motions",
      "Rinse with warm water"
    ],
    benefits: [
      "Exfoliates dead skin cells",
      "Moisturizes skin",
      "Improves skin texture",
      "Provides natural glow"
    ],
    image: "/images/home remedies/Coconut-Lemon-Body-Scrub.jpeg",
    category: ["Exfoliation", "Moisturizing", "Body Care"]
  },
  {
    id: 11,
    name: "Oatmeal and Honey Face Mask",
    description: "A gentle exfoliating mask that helps cleanse and soothe the skin.",
    ingredients: [
      "2 tablespoons oatmeal",
      "1 tablespoon honey",
      "1 tablespoon yogurt"
    ],
    instructions: [
      "Grind oatmeal to a fine powder",
      "Mix with honey and yogurt",
      "Apply to clean face",
      "Leave on for 15 minutes",
      "Rinse with lukewarm water"
    ],
    benefits: [
      "Gently exfoliates skin",
      "Soothes irritation",
      "Cleanses pores",
      "Provides hydration"
    ],
    image: "/images/home remedies/Oatmeal-and-Honey-Face-Mask.jpeg",
    category: ["Exfoliation", "Soothing", "Cleansing"]
  },
  {
    id: 12,
    name: "Cucumber Face Mask",
    description: "A cooling and hydrating face mask that helps refresh tired skin.",
    ingredients: [
      "1/2 cucumber",
      "1 tablespoon yogurt",
      "1 teaspoon honey"
    ],
    instructions: [
      "Blend cucumber to form a smooth paste",
      "Mix with yogurt and honey",
      "Apply to clean face",
      "Leave on for 15 minutes",
      "Rinse with cool water"
    ],
    benefits: [
      "Cools and refreshes skin",
      "Reduces puffiness",
      "Hydrates skin",
      "Tightens pores"
    ],
    image: "/images/home remedies/Cucumber-Face-Mask.webp",
    category: ["Cooling", "Hydration", "Pore Care"]
  },
  {
    id: 13,
    name: "Besan Body Scrub",
    description: "A traditional Indian body scrub that helps exfoliate and brighten the skin.",
    ingredients: [
      "1/2 cup besan (gram flour)",
      "1 tablespoon turmeric powder",
      "1 tablespoon milk",
      "1 teaspoon honey"
    ],
    instructions: [
      "Mix all ingredients to form a smooth paste",
      "Apply to damp skin",
      "Gently massage in circular motions",
      "Leave on for 10 minutes",
      "Rinse with lukewarm water"
    ],
    benefits: [
      "Exfoliates dead skin cells",
      "Brightens skin tone",
      "Improves skin texture",
      "Removes tan"
    ],
    image: "/images/home remedies/Besan-Body-Scrub.jpg",
    category: ["Exfoliation", "Brightening", "Body Care"]
  },
  {
    id: 14,
    name: "Saffron and Honey Face Pack",
    description: "A luxurious face pack that helps brighten and nourish the skin.",
    ingredients: [
      "5-6 strands of saffron",
      "1 tablespoon honey",
      "1 tablespoon milk"
    ],
    instructions: [
      "Soak saffron in milk for 15 minutes",
      "Add honey and mix well",
      "Apply to clean face",
      "Leave on for 15 minutes",
      "Rinse with lukewarm water"
    ],
    benefits: [
      "Brightens skin tone",
      "Reduces pigmentation",
      "Provides natural glow",
      "Nourishes skin"
    ],
    image: "/images/home remedies/Saffron-and-Honey-Face-Pack.png",
    category: ["Brightening", "Nourishing", "Luxury"]
  },
  {
    id: 15,
    name: "Turmeric and Gram Flour Face Pack",
    description: "A traditional Indian face pack that helps brighten and improve skin texture.",
    ingredients: [
      "1 tablespoon gram flour",
      "1/2 teaspoon turmeric powder",
      "1 tablespoon yogurt",
      "1 teaspoon honey"
    ],
    instructions: [
      "Mix all ingredients to form a smooth paste",
      "Apply to clean face",
      "Leave on for 15 minutes",
      "Rinse with lukewarm water"
    ],
    benefits: [
      "Brightens skin tone",
      "Improves skin texture",
      "Reduces pigmentation",
      "Provides natural glow"
    ],
    image: "/images/home remedies/Turmeric-and-Gram-Flour-Face-Pack.webp",
    category: ["Brightening", "Texture", "Traditional"]
  }
]; 