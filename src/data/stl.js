// ── ST. LOUIS, MO ────────────────────────────────────────────────────────────
// X: DIVE (-5) → CLASSY (+5)
// Y: JUST DRINKS (-5) → DESTINATION DINING (+5)

export const CITY = {
  name: "St. Louis",
  state: "MO",
  subdomain: "stl",
};

export const CATEGORIES = {
  "Bar & Pub":      { color: "#a78bfa" },
  "Sports Bar":     { color: "#60a5fa" },
  "Live Music":     { color: "#e879f9" },
  "Brewery":        { color: "#fb923c" },
  "Cocktail Bar":   { color: "#f472b6" },
  "American":       { color: "#fbbf24" },
  "Italian":        { color: "#34d399" },
  "Fine Dining":    { color: "#e06b6b" },
};

export const BARS = [
  // ── Bar & Pub ──
  { name: "Venice Café",          address: "1903 Pestalozzi St",      cat: "Bar & Pub",    price: 5,  x: -3.6, y: -3.2 },
  { name: "The Crack Fox",        address: "1114 Olive St",           cat: "Bar & Pub",    price: 5,  x: -2.8, y: -3.7 },
  { name: "Up-Down STL",          address: "405 N Euclid Ave",        cat: "Bar & Pub",    price: 6,  x: -2.1, y: -1.7 },
  { name: "1860 Saloon",          address: "1860 S 9th St",           cat: "Bar & Pub",    price: 5,  x: -1.6, y:  0.4 },
  { name: "Amsterdam Tavern",     address: "3175 Morgan Ford Rd",     cat: "Bar & Pub",    price: 5,  x: -1.4, y: -1.1 },

  // ── Sports Bar ──
  { name: "The Over/Under",       address: "911 Washington Ave",      cat: "Sports Bar",   price: 9,  x: -0.4, y:  0.7 },
  { name: "Sports & Social",      address: "651 Clark Ave",           cat: "Sports Bar",   price: 10, x: -0.9, y:  1.1 },
  { name: "FanDuel Live!",        address: "601 Clark Ave",           cat: "Sports Bar",   price: 9,  x: -0.7, y:  0.9 },
  { name: "Social Bar Soulard",   address: "1551 S 7th St",           cat: "Sports Bar",   price: 8,  x: -1.3, y:  0.3 },
  { name: "Beffa's",              address: "2700 Olive St",           cat: "Sports Bar",   price: 7,  x:  0.3, y:  1.6 },
  { name: "Paddy O's",            address: "618 S 7th St",            cat: "Sports Bar",   price: 8,  x: -0.6, y: -0.5 },
  { name: "The Pitch",            address: "2 S 20th St",             cat: "Sports Bar",   price: 9,  x: -0.2, y:  1.3 },

  // ── Live Music ──
  { name: "Tin Roof",             address: "1000 Clark Ave",          cat: "Live Music",   price: 10, x:  0.6, y: -1.9 },

  // ── Brewery ──
  { name: "4 Hands Brewing",      address: "1220 S 8th St",           cat: "Brewery",      price: 9,  x:  1.3, y:  2.6 },
  { name: "Civil Life Brewing",   address: "3714 Holt Ave",           cat: "Brewery",      price: 8,  x:  0.9, y:  1.9 },
  { name: "Bluewood Brewing",     address: "1821 Cherokee St",        cat: "Brewery",      price: 8,  x:  0.4, y:  1.3 },
  { name: "Schlafly Bottleworks", address: "7260 Southwest Ave",      cat: "Brewery",      price: 9,  x:  1.6, y:  2.9 },
  { name: "Square One Brewery",   address: "1727 Park Ave",           cat: "Brewery",      price: 10, x:  1.1, y:  2.4 },
  { name: "Blue Jay Brewing",     address: "2710 Locust St",          cat: "Brewery",      price: 8,  x:  0.7, y:  1.1 },

  // ── Cocktail Bar ──
  { name: "Narwhal's Crafted",    address: "3906 Laclede Ave",        cat: "Cocktail Bar", price: 10, x:  2.6, y: -2.4 },
  { name: "New Society",          address: "3194 S Grand Blvd",       cat: "Cocktail Bar", price: 12, x:  3.6, y: -1.4 },
  { name: "Thaxton Speakeasy",    address: "1009 Olive St",           cat: "Cocktail Bar", price: 12, x:  3.1, y: -1.9 },
  { name: "Prohibition",          address: "2017 Chouteau Ave",       cat: "Cocktail Bar", price: 11, x:  3.3, y: -1.7 },
  { name: "Kenny's Upstairs",     address: "3131 S Grand Blvd",       cat: "Cocktail Bar", price: 11, x:  2.9, y: -2.1 },
  { name: "Lazy Tiger",           address: "210 N Euclid Ave",        cat: "Cocktail Bar", price: 12, x:  3.2, y:  0.6 },
  { name: "Trust",                address: "401 Pine St",             cat: "Cocktail Bar", price: 11, x:  3.9, y:  0.9 },
  { name: "Planter's House",      address: "1000 Mississippi Ave",    cat: "Cocktail Bar", price: 12, x:  3.4, y:  2.1 },
  { name: "360 Rooftop Bar",      address: "One S Broadway",          cat: "Cocktail Bar", price: 13, x:  3.7, y: -0.4 },
  { name: "Blood & Sand",         address: "1500 St Charles St",      cat: "Cocktail Bar", price: 14, x:  4.1, y:  2.6 },

  // ── American ──
  { name: "Good Company",         address: "4317 Manchester Ave",     cat: "American",     price: 12, x:  2.6, y:  2.9 },
  { name: "Polite Society",       address: "1923 Park Ave",           cat: "American",     price: 12, x:  3.3, y:  3.6 },
  { name: "Eat Crow",             address: "1931 S 12th St",          cat: "American",     price: 10, x: -0.2, y:  2.1 },
  { name: "Twisted Ranch",        address: "14 Maryland Plaza",       cat: "American",     price: 9,  x: -0.7, y:  1.6 },
  { name: "Olive + Oak",          address: "216 W Lockwood Ave",      cat: "American",     price: 14, x:  4.1, y:  4.1 },
  { name: "Frazer's",             address: "1811 Pestalozzi St",      cat: "American",     price: 13, x:  3.6, y:  3.9 },
  { name: "Pennydrop",            address: "400 Olive St",            cat: "American",     price: 12, x:  2.1, y:  1.4 },

  // ── Italian ──
  { name: "Acero",                address: "7266 Manchester Rd",      cat: "Italian",      price: 14, x:  4.4, y:  4.6 },
  { name: "Roberto's Trattoria",  address: "145 Concord Plaza",       cat: "Italian",      price: 13, x:  4.2, y:  4.3 },

  // ── Fine Dining ──
  { name: "Sidney Street Café",   address: "2000 Sidney St",          cat: "Fine Dining",  price: 14, x:  4.0, y:  4.4 },
  { name: "801 Chophouse",        address: "137 Carondelet Plaza",    cat: "Fine Dining",  price: 15, x:  4.6, y:  4.8 },
];
