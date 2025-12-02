import { Recipe, Blog, ChatMessage, User, SubscriptionTier, ContactMessage, MealPlanEntry, ChefChatSession, RecipeCollection } from "../types";
import { sanitizeHTML } from "../utils/security";

// Helper to slugify titles
const slugify = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

const MOCK_RECIPES: Recipe[] = [
  {
    id: "r_scallops",
    title: "Pan Seared Scallops with Truffle Pea Purée",
    slug: "pan-seared-scallops-with-truffle-pea-puree",
    origin: "Provence, France",
    description: "These golden-crusted scallops sit atop a vibrant, silky pea purée infused with white truffle oil. It's a restaurant-quality dish that brings the elegance of Provence to your dining table.",
    ingredients: [
      "10 large sea scallops (U10 dry), side muscle removed",
      "2 tablespoons unsalted butter",
      "1 tablespoon olive oil",
      "2 cups frozen sweet peas, thawed",
      "1 small shallot, finely minced",
      "1/4 cup heavy cream",
      "1 teaspoon white truffle oil",
      "Salt and freshly ground black pepper",
      "Fresh mint leaves for garnish",
      "Lemon wedges for serving"
    ],
    steps: [
      "Pat the scallops very dry with paper towels. Season generously with salt and pepper on both sides.",
      "In a small saucepan, sauté the shallot in 1 tablespoon of butter until soft. Add peas and cook for 2-3 minutes. Transfer to a blender with cream, truffle oil, and a pinch of salt. Blend until smooth.",
      "Heat a large stainless steel skillet over high heat. Add olive oil and remaining butter. When the butter foams, add scallops. Do not crowd.",
      "Sear undisturbed for 2 minutes until a deep golden crust forms. Flip and cook for 1 minute on the other side. The internal temperature should be approximately 115°F (46°C).",
      "Spread pea purée on plates. Top with scallops. Garnish with mint and lemon."
    ],
    prep_time: "20 min",
    prep_time_minutes: 20,
    cook_time_minutes: 10,
    total_time_minutes: 30,
    servings: 2,
    calories: 380,
    nutrition: { fat: 22, carbs: 18, protein: 28 },
    tags: ["Seafood", "Dinner", "French", "Gluten-Free", "Date Night"],
    image_url: "https://placehold.co/1000x600/a38b79/ffffff?text=Seared+Scallops",
    imagePrompt: "Close up high resolution shot of Pan-Seared Scallops with Truffle Pea Purée on a ceramic plate, cinematic lighting, garnish with mint.",
    affiliate_products: [
      { 
        name: "White Truffle Oil", 
        link: "https://example.com/truffle-oil", 
        price: "$24.99", 
        description: "Authentic Italian white truffle infused oil.", 
        clicks: 0,
        image_url: "https://placehold.co/200x200/e0e0e0/333?text=Truffle+Oil"
      },
      { 
        name: "Stainless Steel Skillet", 
        link: "https://example.com/skillet", 
        price: "$89.00", 
        description: "Professional grade tri-ply stainless steel.", 
        clicks: 0,
        image_url: "https://placehold.co/200x200/e0e0e0/333?text=Skillet"
      },
      { 
        name: "High-Speed Blender", 
        link: "https://example.com/blender", 
        price: "$149.99", 
        description: "Perfect for silky smooth purées.", 
        clicks: 0,
        image_url: "https://placehold.co/200x200/e0e0e0/333?text=Blender"
      }
    ],
    rating: 5.0,
    reviews: 2,
    reviews_list: [
      { rating: 5, text: "Absolutely stunning dish. The truffle oil makes it." },
      { rating: 5, text: "Easier than I thought to get a good sear." }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: "r_pancakes",
    title: "Pumpkin Pancakes",
    slug: "pumpkin-pancakes",
    origin: "Vermont, USA",
    image_url: "https://placehold.co/1000x600/d48a6a/ffffff?text=Pumpkin+Pancakes",
    imagePrompt: "Stack of fluffy pumpkin pancakes with maple syrup dripping down, autumn light, cozy atmosphere, 4k resolution.",
    description: "Soft, fluffy pumpkin pancakes with warm spices — perfect for fall breakfasts, cozy weekends, or anyone who loves rich pumpkin flavor. This recipe is simple and fast, great for a quick brunch.",
    prep_time: "10 min",
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    total_time_minutes: 25,
    servings: 4,
    calories: 265,
    nutrition: { fat: 10, carbs: 35, protein: 7 },
    tags: [
      "Breakfast",
      "Fall",
      "Easy",
      "Family Friendly",
      "Brunch"
    ],
    ingredients: [
      "1 cup all-purpose flour",
      "1 tablespoon brown sugar",
      "1 teaspoon baking powder",
      "1/2 teaspoon baking soda",
      "1/2 teaspoon cinnamon",
      "1/4 teaspoon nutmeg",
      "1/4 teaspoon salt",
      "3/4 cup milk",
      "1/2 cup pumpkin purée (not pumpkin pie filling)",
      "1 large egg, lightly beaten",
      "1 tablespoon melted butter or oil",
      "1 teaspoon vanilla extract"
    ],
    steps: [
      "Whisk flour, brown sugar, baking powder, baking soda, salt, cinnamon, and nutmeg in a large bowl. Ensure all dry ingredients are combined.",
      "In a separate bowl, mix milk, pumpkin purée, egg, melted butter, and vanilla until smooth.",
      "Pour the wet ingredients into the dry ingredients and stir until just combined — do not overmix. Lumps are acceptable for fluffy pancakes.",
      "Heat a lightly oiled pan or griddle over medium heat (about 350°F or 175°C).",
      "Scoop approximately 1/4 cup batter for each pancake onto the hot surface and cook until bubbles appear on the surface. Flip and cook for 1–2 minutes more until golden brown.",
      "Serve warm with maple syrup, whipped cream, or butter."
    ],
    affiliate_products: [
      {
        name: "Non-stick Griddle Pan",
        link: "https://example.com/griddle",
        clicks: 0,
        price: "$45.00",
        description: "Even heating for perfect pancakes",
        image_url: "https://placehold.co/200x200/e0e0e0/333?text=Griddle"
      },
      {
        name: "Pumpkin Purée 100% Natural",
        link: "https://example.com/pumpkin",
        clicks: 0,
        price: "$4.50",
        description: "Rich, natural flavor",
        image_url: "https://placehold.co/200x200/e0e0e0/333?text=Pumpkin"
      },
      {
        name: "Cinnamon Spice Blend",
        link: "https://example.com/cinnamon",
        clicks: 0,
        price: "$12.00",
        description: "Aromatic autumn blend",
        image_url: "https://placehold.co/200x200/e0e0e0/333?text=Cinnamon"
      }
    ],
    rating: 4.5,
    reviews: 2,
    reviews_list: [
      {
        rating: 5,
        text: "So fluffy and full of pumpkin flavor!"
      },
      {
        rating: 4,
        text: "Perfect fall breakfast. Added chocolate chips — amazing."
      }
    ],
    created_at: new Date(Date.now() - 50000).toISOString()
  },
  {
    id: "r_lasagna",
    title: "Classic Homemade Lasagna with Rich Bolognese",
    slug: "classic-homemade-lasagna",
    origin: "Bologna, Italy",
    description: "This is the ultimate, traditional Italian-American lasagna recipe. It features a rich, slow-simmered meat sauce, creamy ricotta, and perfectly al dente noodles.",
    ingredients: [
      "1 pound ground beef (80/20 mix)",
      "1 pound Italian sausage (mild or hot, casings removed)",
      "1 large yellow onion, finely chopped",
      "4 cloves garlic, minced",
      "2 (28 ounce) cans crushed tomatoes",
      "1 (6 ounce) can tomato paste",
      "2 teaspoons dried oregano",
      "1 teaspoon dried basil",
      "1 teaspoon salt",
      "1/2 teaspoon black pepper",
      "1 (15 ounce) container whole-milk ricotta cheese",
      "1 large egg, lightly beaten",
      "1/4 cup fresh parsley, chopped",
      "1 pound lasagna noodles",
      "4 cups shredded mozzarella cheese",
      "1/2 cup grated Parmesan cheese"
    ],
    steps: [
      "Make the Bolognese Sauce: Brown the ground beef and Italian sausage. Drain fat. Sauté onion and garlic until soft.",
      "Stir in tomato paste, crushed tomatoes, oregano, basil, salt, and pepper. Simmer for at least 30 minutes.",
      "Prepare the Cheese Filling: Combine ricotta cheese, beaten egg, chopped parsley, salt, and pepper.",
      "Assemble: Spread sauce on bottom of 13x9 dish. Layer noodles, half of ricotta mixture, one-third of mozzarella. Repeat layers.",
      "Cover with foil and bake at 375°F (190°C) for 45 minutes. Remove foil, add remaining cheese, bake 15 mins until bubbly.",
      "Rest for 15-20 minutes before slicing to ensure layers set perfectly."
    ],
    prep_time: "45 min",
    prep_time_minutes: 45,
    cook_time_minutes: 60,
    total_time_minutes: 105,
    servings: 8,
    calories: 420,
    nutrition: { fat: 22, carbs: 35, protein: 25 },
    tags: ["Italian", "Dinner", "Comfort Food", "Pasta", "Beef"],
    image_url: "https://placehold.co/1000x600/c94444/ffffff?text=Lasagna",
    imagePrompt: "Freshly baked lasagna in a white casserole dish, bubbly cheese, fresh basil garnish, rustic wooden table.",
    affiliate_products: [
      { 
        name: "13x9 Nonstick Baking Dish", 
        link: "https://example.com/baking-dish", 
        price: "$24.99", 
        description: "Heavy-duty steel with nonstick coating", 
        clicks: 150,
        image_url: "https://placehold.co/200x200/e0e0e0/333?text=Dish"
      },
      { 
        name: "Le Creuset Dutch Oven", 
        link: "https://example.com/dutch-oven", 
        price: "$359.99", 
        description: "Enameled Cast Iron, 5.5 qt", 
        clicks: 85,
        image_url: "https://placehold.co/200x200/e0e0e0/333?text=Dutch+Oven"
      }
    ],
    rating: 4.8,
    reviews: 1240,
    reviews_list: [
      { rating: 5, text: "The meat sauce is incredible." },
      { rating: 5, text: "Best lasagna I've ever made." }
    ],
    created_at: new Date(Date.now() - 100000).toISOString()
  },
  {
    id: "r1",
    title: "Tropical Mango Chicken",
    slug: "tropical-mango-chicken",
    origin: "Kingston, Jamaica",
    description: "A sweet and spicy Caribbean delight featuring juicy chicken breasts seared to perfection and simmered in a rich coconut mango sauce.",
    ingredients: [
      "2 large chicken breasts, sliced", 
      "1 ripe mango, cubed", 
      "400ml coconut milk", 
      "2 tbsp lime juice", 
      "1 cup jasmine rice", 
      "Fresh cilantro bunch", 
      "1 red bell pepper, diced", 
      "1 tsp scotch bonnet pepper sauce"
    ],
    steps: [
      "Marinate chicken slices in lime juice and scotch bonnet sauce for 30 minutes.",
      "In a hot skillet, sear chicken until golden brown, approx 4 minutes per side.",
      "Lower heat, add diced peppers and mango cubes, sautéing for 2 minutes.",
      "Pour in coconut milk and simmer for 10 minutes until sauce thickens.",
      "Serve hot over steamed jasmine rice, garnished generously with fresh cilantro."
    ],
    prep_time: "35 min",
    prep_time_minutes: 35,
    cook_time_minutes: 20,
    total_time_minutes: 55,
    servings: 2,
    calories: 420,
    nutrition: { fat: 18, carbs: 42, protein: 35 },
    tags: ["Tropical", "Dinner", "Gluten-Free", "Spicy"],
    image_url: "https://placehold.co/1000x600/f5b74c/ffffff?text=Mango+Chicken",
    imagePrompt: "Plate of tropical mango chicken with jasmine rice, bright colors, fresh cilantro, sunny caribbean vibe.",
    affiliate_products: [
      { name: "Le Creuset Skillet", link: "#", price: "$180", description: "Enameled Cast Iron Signature Skillet", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Skillet" },
      { name: "Global Chef's Knife", link: "#", price: "$120", description: "8-inch Chef's Knife", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Knife" },
      { name: "Organic Coconut Milk", link: "#", price: "$4", description: "Premium Full-Fat Coconut Milk", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Milk" }
    ],
    rating: 4.9,
    reviews: 842,
    reviews_list: [{rating: 5, text: "Tastes like vacation!"}],
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "r2",
    title: "Garlic Shrimp Linguine",
    slug: "garlic-shrimp-linguine",
    origin: "Positano, Italy",
    description: "Classic Italian coastal pasta dish with succulent tiger prawns, white wine, and plenty of garlic.",
    ingredients: [
      "300g Tiger Prawns, peeled", 
      "400g Linguine pasta", 
      "6 cloves garlic, minced", 
      "1/2 cup Pinot Grigio", 
      "50g cold butter", 
      "Fresh parsley, chopped", 
      "1 tsp chili flakes"
    ],
    steps: [
      "Bring a large pot of salted water to boil and cook linguine until al dente.",
      "In a wide pan, sauté garlic and chili flakes in olive oil until fragrant.",
      "Add prawns and cook for 2 minutes until pink. Remove prawns.",
      "Deglaze pan with wine, reduce by half, then whisk in cold butter.",
      "Toss pasta and prawns in the sauce. Finish with parsley."
    ],
    prep_time: "25 min",
    prep_time_minutes: 10,
    cook_time_minutes: 15,
    total_time_minutes: 25,
    servings: 4,
    calories: 580,
    nutrition: { fat: 24, carbs: 65, protein: 28 },
    tags: ["Pasta", "Seafood", "Italian", "Date Night"],
    image_url: "https://placehold.co/1000x600/e6d6b3/ffffff?text=Shrimp+Linguine",
    imagePrompt: "Garlic Shrimp Linguine on a white plate, steam rising, glass of white wine in background, soft restaurant lighting.",
    affiliate_products: [
      { name: "Marcato Atlas Pasta Maker", link: "#", price: "$85", description: "Authentic Italian Pasta Machine", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Pasta+Maker" },
      { name: "Stainless Steel Tongs", link: "#", price: "$12", description: "Precision Locking Tongs", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Tongs" }
    ],
    rating: 4.8,
    reviews: 320,
    reviews_list: [{rating: 5, text: "Simple and elegant."}],
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "r3",
    title: "Lemon Vanilla Bean Cupcakes",
    slug: "lemon-vanilla-bean-cupcakes",
    origin: "Paris, France",
    description: "Light, airy lemon cupcakes speckled with real vanilla bean paste and topped with a fluffy cream frosting.",
    ingredients: [
      "2 cups Cake Flour", 
      "1 cup Unsalted Butter, softened", 
      "2 tbsp Lemon Zest", 
      "1 tbsp Vanilla Bean Paste", 
      "4 large Eggs", 
      "1 cup Granulated Sugar", 
      "1/2 cup Heavy Cream"
    ],
    steps: [
      "Preheat oven to 350°F (175°C) and line muffin tin.",
      "Cream butter and sugar until pale and fluffy (approx 5 mins).",
      "Add eggs one at a time, followed by vanilla and zest.",
      "Fold in flour alternately with cream. Do not overmix.",
      "Bake for 18-20 minutes. Cool completely before frosting."
    ],
    prep_time: "50 min",
    prep_time_minutes: 30,
    cook_time_minutes: 20,
    total_time_minutes: 50,
    servings: 12,
    calories: 320,
    nutrition: { fat: 16, carbs: 42, protein: 4 },
    tags: ["Dessert", "Baking", "Sweet", "Vegetarian"],
    image_url: "https://placehold.co/1000x600/f5e1e1/ffffff?text=Cupcakes",
    imagePrompt: "Pastel yellow lemon cupcakes with vanilla bean frosting on a tiered stand, afternoon tea setting.",
    affiliate_products: [
      { name: "KitchenAid Artisan Mixer", link: "#", price: "$449", description: "5-Quart Tilt-Head Stand Mixer", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Mixer" },
      { name: "Wilton Piping Set", link: "#", price: "$25", description: "Master Decorating Tip Set", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Piping+Set" }
    ],
    rating: 4.7,
    reviews: 156,
    reviews_list: [{rating: 5, text: "The lemon zest pops!"}],
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "r4",
    title: "Healthy Salmon Power Bowl",
    slug: "healthy-salmon-power-bowl",
    origin: "Tokyo, Japan",
    description: "A vibrant and nutritious bowl featuring perfectly glazed salmon, creamy avocado, and a medley of fresh greens and grains.",
    ingredients: [
      "2 Salmon Fillets, skin-on", 
      "1/2 cup Homemade Teriyaki Sauce",
      "1 cup Mixed Greens or Arugula",
      "1/2 Avocado, sliced",
      "1/4 cup Pomegranate Seeds",
      "1 tbsp Toasted Sesame Seeds", 
      "1 cup Brown Rice or Quinoa, cooked"
    ],
    steps: [
      "Marinate salmon in teriyaki sauce for 20 minutes.",
      "Heat pan over medium-high heat. Sear salmon skin-side down for 4 minutes.",
      "Flip, cook for 2 more minutes, brushing with extra glaze.",
      "Arrange greens and rice in bowls. Top with salmon, sliced avocado, and pomegranate seeds.",
      "Garnish with sesame seeds and serve immediately."
    ],
    prep_time: "25 min",
    prep_time_minutes: 25,
    cook_time_minutes: 10,
    total_time_minutes: 35,
    servings: 2,
    calories: 480,
    nutrition: { fat: 22, carbs: 40, protein: 34 },
    tags: ["Healthy", "Japanese", "Fish", "High Protein", "Bowl"],
    image_url: "https://placehold.co/1000x600/7a9c8a/ffffff?text=Salmon+Bowl",
    imagePrompt: "Teriyaki salmon power bowl with avocado and pomegranate seeds, chopsticks resting on bowl, dark moody lighting.",
    affiliate_products: [
      { name: "Zojirushi Rice Cooker", link: "#", price: "$160", description: "Micom Rice Cooker & Warmer", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Rice+Cooker" },
      { name: "Ceramic Bento Box", link: "#", price: "$28", description: "Modern Lunch Container", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Bento" }
    ],
    rating: 4.8,
    reviews: 512,
    reviews_list: [{rating: 4, text: "Great weeknight dinner."}],
    created_at: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: "r5",
    title: "Artisan Sourdough Loaf",
    slug: "artisan-sourdough-loaf",
    origin: "San Francisco, USA",
    description: "The gold standard of bread baking. Crusty ear, open crumb, and a complex sour flavor developed over 24 hours.",
    ingredients: [
      "500g Bread Flour", 
      "100g Active Sourdough Starter", 
      "350g Warm Water", 
      "10g Sea Salt"
    ],
    steps: [
      "Mix flour and water. Let rest for 1 hour (autolyse).",
      "Add starter and salt. Pinch to incorporate.",
      "Perform coil folds every 30 minutes for 4 hours.",
      "Shape and proof in banneton overnight in the fridge.",
      "Bake in preheated Dutch oven at 450°F for 45 minutes."
    ],
    prep_time: "24 hr",
    prep_time_minutes: 1440,
    cook_time_minutes: 45,
    total_time_minutes: 1485,
    servings: 12,
    calories: 210,
    nutrition: { fat: 1, carbs: 45, protein: 7 },
    tags: ["Baking", "Vegan", "Classic", "Bread"],
    image_url: "https://placehold.co/1000x600/c2a78e/ffffff?text=Sourdough",
    imagePrompt: "Rustic sourdough loaf with flour dusting on dark wooden board, sliced to reveal open crumb.",
    affiliate_products: [
      { name: "Lodge Dutch Oven", link: "#", price: "$75", description: "6 Quart Enameled Dutch Oven", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Dutch+Oven" },
      { name: "Banneton Proofing Basket", link: "#", price: "$20", description: "9-inch Round Basket", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Basket" }
    ],
    rating: 4.9,
    reviews: 1024,
    reviews_list: [{rating: 5, text: "Worth the wait."}],
    created_at: new Date().toISOString()
  },
  {
    id: "r6",
    title: "Vibrant Quinoa Power Salad",
    slug: "vibrant-quinoa-power-salad",
    origin: "Mexico City, Mexico",
    description: "A fresh and vibrant salad celebrating seasonal produce, packed with protein and nutrients.",
    ingredients: [
      "1 cup cooked Quinoa",
      "2 Ripe Avocados, diced", 
      "1 cup Cherry Tomatoes, halved", 
      "1/4 Red Onion, thinly sliced", 
      "1/2 cup Fresh Cilantro",
      "1/4 cup toasted Almonds",
      "2 cups Arugula or mixed greens",
      "1 Lime, juiced", 
      "2 tbsp Extra Virgin Olive Oil",
      "Salt and pepper to taste"
    ],
    steps: [
      "In a large bowl, combine cooked quinoa, arugula, diced avocado, and tomatoes.",
      "Add red onion, toasted almonds, and chopped cilantro.",
      "Whisk lime juice, olive oil, salt, and pepper in a small jar.",
      "Pour dressing over the salad and toss gently to coat.",
      "Serve immediately as a light lunch or side dish."
    ],
    prep_time: "15 min",
    prep_time_minutes: 15,
    cook_time_minutes: 0,
    total_time_minutes: 15,
    servings: 2,
    calories: 250,
    nutrition: { fat: 18, carbs: 20, protein: 8 },
    tags: ["Salad", "Raw", "Keto", "Vegan", "Gluten-Free"],
    image_url: "https://placehold.co/1000x600/96b3a3/ffffff?text=Quinoa+Salad",
    imagePrompt: "Overhead shot of quinoa power salad with avocado and nuts in a colorful ceramic bowl, bright daylight.",
    affiliate_products: [
      { name: "Global Sai Knife", link: "#", price: "$140", description: "Vegetable Knife", clicks: 0, image_url: "https://placehold.co/200x200/e0e0e0/333?text=Knife" }
    ],
    rating: 4.6,
    reviews: 89,
    reviews_list: [{rating: 5, text: "So fresh!"}],
    created_at: new Date().toISOString()
  }
];

const MOCK_BLOGS: Blog[] = [
  {
    id: "b1",
    title: "The Minimalist Kitchen Aesthetic",
    slug: "minimalist-kitchen-aesthetic",
    category: "Lifestyle",
    content: "Creating a serene cooking environment starts with decluttering. We explore how top interior designers are reimagining the kitchen as a space of calm, utilizing hidden storage and natural stone materials to create a sanctuary for the modern chef. The focus is on tactile surfaces—honed marble, unlacquered brass, and matte woods—that age beautifully with use.",
    image_url: "https://placehold.co/1000x600/e3e0d8/ffffff?text=Minimalist+Kitchen",
    author: "Sarah Jenkins",
    created_at: new Date().toISOString()
  },
  {
    id: "b2",
    title: "Apron Couture: The Denim Revolution",
    slug: "apron-couture-denim-revolution",
    category: "Fashion",
    content: "Functionality meets runway style in this season's culinary wear. From Japanese selvedge denim aprons to breathable, tailored chef jackets, we look at the brands that are dressing the world's best kitchen brigades. It's no longer just about protection; it's about projecting an identity of craftsmanship and style. This trend merges industrial durability with sartorial elegance.",
    image_url: "https://placehold.co/1000x600/5a677a/ffffff?text=Denim+Apron",
    author: "Marcello Rossi",
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "b3",
    title: "The Renaissance of Fermentation",
    slug: "renaissance-of-fermentation",
    category: "Food",
    content: "Fermentation is more than just a trend; it's a return to ancestral wisdom. Discover how simple ingredients like cabbage, salt, and time can transform into complex, probiotic-rich superfoods. We delve into the science of lacto-fermentation and why top chefs are creating their own misos and garums to add depth and umami to their tasting menus.",
    image_url: "https://placehold.co/1000x600/c09f80/ffffff?text=Fermentation",
    author: "Culinary Lab Team",
    created_at: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "b4",
    title: "Mindful Eating: The Slow Food Movement",
    slug: "mindful-eating-slow-food",
    category: "Wellness",
    content: "In a fast-paced world, the act of eating often becomes an afterthought. We discuss the importance of slowing down, chewing thoroughly, and engaging all senses to improve digestion and satisfaction. Connecting with the source of your food—the farmers, the soil—grounds us and enhances the nutritional value of every meal.",
    image_url: "https://placehold.co/1000x600/a3b18a/ffffff?text=Mindful+Eating",
    author: "Dr. Emily Chen",
    created_at: new Date(Date.now() - 259200000).toISOString()
  }
];

const MOCK_CHAT: ChatMessage[] = [
  {
    id: "c1",
    user_id: "user_1",
    username: "ChefMario",
    message: "The balance of acidity in the Tropical Mango Chicken is perfect.",
    is_flagged: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "c2",
    user_id: "user_2",
    username: "BakerKate",
    message: "Has anyone tried substituting coconut sugar in the cupcakes?",
    is_flagged: false,
    created_at: new Date(Date.now() - 1800000).toISOString()
  }
];

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: "m1",
    name: "HexClad Cookware",
    email: "partnerships@hexclad.com",
    type: "Sponsorship",
    subject: "Partnership Opportunity for Q4",
    message: "Hello, we'd love to sponsor your next series of high-end seafood recipes. We have a new line of pans launching soon.",
    status: "unread",
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "m2",
    name: "Spiceology",
    email: "affiliates@spiceology.com",
    type: "Affiliate",
    subject: "Affiliate Program Invitation",
    message: "We'd like to invite Recipe Atlas to our exclusive tier affiliate program with 15% commission rates.",
    status: "read",
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// MOCK COLLECTIONS DATA
const MOCK_COLLECTIONS: RecipeCollection[] = [
    {
        id: 'coll1',
        slug: 'weeknight-wonders',
        name: 'Weeknight Wonders',
        description: 'Quick and easy recipes perfect for busy weeknights.',
        authorName: 'ChefMario',
        recipeIds: ['r_pancakes', 'r1', 'r2', 'r4']
    }
];

export const db = {
  // --- MOCK DB (localStorage & arrays) ---
  getRecipes: async (): Promise<Recipe[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_RECIPES]), 400));
  },
  getRecipeBySlug: async (slug: string): Promise<Recipe | undefined> => {
     return new Promise(resolve => setTimeout(() => resolve(MOCK_RECIPES.find(r => r.slug === slug)), 300));
  },
  addRecipe: async (recipe: Recipe): Promise<void> => {
    MOCK_RECIPES.unshift(recipe);
  },
  getBlogs: async (): Promise<Blog[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_BLOGS]), 400));
  },
  addBlog: async (blog: Blog): Promise<void> => {
    MOCK_BLOGS.unshift(blog);
  },
  getChatLogs: async (): Promise<ChatMessage[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_CHAT]), 300));
  },
  addChatMessage: async (msg: ChatMessage): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    MOCK_CHAT.push({ ...msg, message: sanitizeHTML(msg.message) });
  },
  trackAffiliateClick: async (productId: string, recipeId: string): Promise<string> => {
    console.log(`[CLIENT] Tracking click for Product: ${productId} on Recipe: ${recipeId}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    let link = "#";
    for (const r of MOCK_RECIPES) {
        const p = r.affiliate_products.find(p => p.name === productId); 
        if (p) {
            link = p.link;
            break;
        }
    }
    return link;
  },
  
  // --- MOCK AUTH ---
  login: async (email: string, password: string): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
          id: 'u_' + Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email: email,
          subscriptionTier: 'free',
          memberSince: new Date().toISOString()
      };
  },
  signup: async (name: string, email: string, password: string, tier: SubscriptionTier): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
          id: 'u_' + Math.random().toString(36).substr(2, 9),
          name,
          email,
          subscriptionTier: tier,
          memberSince: new Date().toISOString()
      };
  },
  logout: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
  },

  // --- MOCK USER DATA (LocalStorage) ---
  getUserSavedRecipes: (userId: string): string[] => {
      try {
          const key = `savedRecipes_${userId}`;
          const saved = localStorage.getItem(key);
          return saved ? JSON.parse(saved) : [];
      } catch {
          return [];
      }
  },
  toggleSavedRecipe: (userId: string, recipeId: string): boolean => {
      try {
          const key = `savedRecipes_${userId}`;
          const saved = localStorage.getItem(key);
          let savedIds = saved ? JSON.parse(saved) : [];
          if (!Array.isArray(savedIds)) savedIds = [];
          
          let isSaved = false;
          if (savedIds.includes(recipeId)) {
              savedIds = savedIds.filter((id: string) => id !== recipeId);
              isSaved = false;
          } else {
              savedIds.push(recipeId);
              isSaved = true;
          }
          localStorage.setItem(key, JSON.stringify(savedIds));
          return isSaved;
      } catch {
          return false;
      }
  },
  getMealPlan: (userId: string): MealPlanEntry[] => {
    try {
      const key = `mealPlan_${userId}`;
      const plan = localStorage.getItem(key);
      return plan ? JSON.parse(plan) : [];
    } catch {
      return [];
    }
  },
  saveMealPlan: (userId: string, plan: MealPlanEntry[]): void => {
    const key = `mealPlan_${userId}`;
    localStorage.setItem(key, JSON.stringify(plan));
  },
  sendContactMessage: async (msg: Omit<ContactMessage, 'id' | 'created_at' | 'status'>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newMessage: ContactMessage = {
      id: crypto.randomUUID(),
      ...msg,
      message: sanitizeHTML(msg.message),
      subject: sanitizeHTML(msg.subject),
      status: 'unread',
      created_at: new Date().toISOString()
    };
    try {
      const stored = localStorage.getItem('contact_messages');
      const messages = stored ? JSON.parse(stored) : INITIAL_MESSAGES;
      messages.unshift(newMessage);
      localStorage.setItem('contact_messages', JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save message to localStorage", e);
    }
  },
  getAdminMessages: async (): Promise<ContactMessage[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        let localMessages: ContactMessage[] = [];
        try {
          const stored = localStorage.getItem('contact_messages');
          if (stored) {
            localMessages = JSON.parse(stored);
          }
        } catch (e) {
          console.error("Failed to load messages from localStorage", e);
        }
        resolve(localMessages.length > 0 ? localMessages : INITIAL_MESSAGES);
      }, 400);
    });
  },
  getChefChatHistory: async (userId: string): Promise<ChefChatSession[]> => {
      try {
          const key = `chefChatHistory_${userId}`;
          const history = localStorage.getItem(key);
          return history ? JSON.parse(history) : [];
      } catch {
          return [];
      }
  },
  saveChefChatSession: (userId: string, session: ChefChatSession): void => {
      try {
          const key = `chefChatHistory_${userId}`;
          const existingStr = localStorage.getItem(key);
          let history: ChefChatSession[] = existingStr ? JSON.parse(existingStr) : [];
          
          const sanitizedSession = {
              ...session,
              messages: session.messages.map(m => ({ ...m, text: sanitizeHTML(m.text) }))
          };

          const idx = history.findIndex(s => s.recipeId === sanitizedSession.recipeId);
          if (idx >= 0) {
              history[idx] = sanitizedSession;
          } else {
              history.unshift(sanitizedSession);
          }
          localStorage.setItem(key, JSON.stringify(history));
      } catch (e) {
          console.error("Failed to save chef chat", e);
      }
  },
  clearChefChatSession: (userId: string, recipeId: string): void => {
      try {
          const key = `chefChatHistory_${userId}`;
          const existingStr = localStorage.getItem(key);
          if (!existingStr) return;
          let history: ChefChatSession[] = JSON.parse(existingStr);
          
          const newHistory = history.filter(s => s.recipeId !== recipeId);
          
          localStorage.setItem(key, JSON.stringify(newHistory));
      } catch (e) {
          console.error("Failed to clear chef chat session", e);
      }
  },
  getCollectionsForUser: async (userId: string): Promise<RecipeCollection[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_COLLECTIONS]), 300));
  },
  getCollectionBySlug: async (slug: string): Promise<RecipeCollection | null> => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_COLLECTIONS.find(c => c.slug === slug) || null), 300));
  },
  createCollection: async (userId: string, name: string, description: string): Promise<RecipeCollection> => {
    const newCollection: RecipeCollection = {
        id: crypto.randomUUID(),
        slug: slugify(name),
        name: sanitizeHTML(name),
        description: sanitizeHTML(description),
        authorName: 'You', // Placeholder
        recipeIds: []
    };
    MOCK_COLLECTIONS.push(newCollection);
    return new Promise(resolve => setTimeout(() => resolve(newCollection), 300));
  },
  addRecipeToCollection: async (userId: string, collectionId: string, recipeId: string): Promise<void> => {
     const collection = MOCK_COLLECTIONS.find(c => c.id === collectionId);
     if (collection && !collection.recipeIds.includes(recipeId)) {
        collection.recipeIds.push(recipeId);
     }
     return new Promise(resolve => setTimeout(resolve, 300));
  },
};--- START OF FILE .gitignore ---

# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*--- START OF FILE LICENSE ---

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
