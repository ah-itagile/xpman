# XPMan

The most realistic simulation of a project using XP techniques.
Avoid SAFe managers!
Integrate as often as possible to avoid bugs!
Do pair programming! 

# Development

The project is based on Phaser 3 with ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/)
that includes hot-reloading for development and production-ready builds.


## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm start` | Build project and open web server running project at `http://localhost:8080`|
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) into a single bundle located at `dist/bundle.min.js` along with any other assets|
| `npm test` | Execute tests
| `npm run watch` | Execute continuously tests.

## Tests
Use `npm test` for test execution in console.
Use `npm run watch` for continuous test execution. Hint: Use integrated terminal pane in VS Code.
Use `Jasmine Test` in debug view in VS Code for debugging.
Put a `f` infront of a test if you want to execute just one test (`fit` )

## Using Tiled
You need a tileset and map

### Tileset
Open `dev_assets/tiled/xpman-tileset.tsx`

Or for a fresh start: After editing xpman-tileset.xcf in Gimp export as png to `src/assets/xpman-tileset.png`
In Tiled: Import tileset from image. (e.g. `src/assets/xpman-tileset.png`)

### Map
Open `dev_assets/tiled/xpman-levelX.tsx`
After editing "Export as" CSV (e.g. 'assets/xpman-level1.csv').
