import plot from './plot';

const SVGChrt = require('svgchrt');

const possibleTypes = ['overlaid', 'clustered', 'stacked', 'stacked100'];

class SVGChrtColumn extends SVGChrt {
  plot = plot;
}

module.exports = SVGChrtColumn; // Could use this in svgchrt to export the bits I and the user need to add stuff?
