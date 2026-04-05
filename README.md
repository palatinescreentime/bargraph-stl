# 🍺 The Bar Graph — St. Louis, MO

Live at **[stl.bargraph.city](https://stl.bargraph.city)**

Part of the [Bar Graph](https://bargraph.city) network — interactive scatter plots
mapping local bars and restaurants by vibe and food quality.

## Adding/editing bars
Edit `src/data/stl.js` — each entry:
```js
{ name: "Bar Name", address: "123 Main St", cat: "Cocktail Bar", price: 12, x: 3.2, y: 1.5 }
```
- `x`: -5 (Dive) → +5 (Classy)
- `y`: -5 (Just Drinks) → +5 (Destination Dining)
- `price`: average drink in dollars

## Running locally
```bash
npm install
npm run dev
```
