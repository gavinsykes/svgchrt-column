/// <reference types="svgchrt" />

import plot from './plot';

import { SVGChrt } from 'svgchrt';

console.log(SVGChrt);

const possibleTypes = ['overlaid', 'clustered', 'stacked', 'stacked100'];

class SVGChrtColumn extends SVGChrt {
  plot = plot;
}

// Could use this in svgchrt to export the bits I and the user need to add stuff?
module.exports = SVGChrtColumn;
