SVGChrt-Column
==============

![npm](https://img.shields.io/npm/v/svgchrt)
![npm](https://img.shields.io/npm/dm/svgchrt)
![GitHub top language](https://img.shields.io/github/languages/top/gavinsykes/svgchrt)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/gavinsykes/svgchrt)
![NPM](https://img.shields.io/npm/l/svgchrt)

The easiest way to put together a column chart visualisation in SVG.
--------------------------------------------------------------------
Based on svgchrt
----------------

### Installation

`npm install svgchrt-column`

`<script src="https://unpkg.com/svgchrt-column"></script>`

### Usage

```javascript
const SVGChrtColumn = require('svgchrt-column');

const options = {}; // How you want the visualisation to look
const data = []; // What data you want to represent

const Chart =  new SVGChrtColumn(options,data);

Chart.render();
```

### Reference

#### Available options:

1. background (boolean), default: `true`

   Decides whether or not to give your chart a background to make it stand out from the page. If set to `true` it will provide a `<rect>` element with the class of `chart-background` for styling with CSS, and its `height` and `width` attributes will match those of the parent `<svg>`.

1. canvas (object)

   Contains 4 items:

   1. height (integer), default: `500`

      Determines the height of your visualisation in pixels.

   1. padding (object)

      Contains 4 items: `top`, `right`, `bottom` and `left`, each of which defaults to `10` and provides an inner padding so that your visualisation is not squashed up to the edge of the SVG.

   1. viewBox (string), default: `'0 0 960 500'`

      Determines the viewBox of your `<svg>` and should usually match `0 0 width height`.

   1. width (integer), default: `960`

      Determines the width of your visualisation in pixels.

1. chart (object)

   Contains 2 items:

   1. axes (object)

      Contains 4 items: `bottom`, `left`, `top` and `right`, each of which is also an object containing 2 items:

      1. display (boolean), default: `false`

         Decides whether or not to display the axis - currently you have to have one of the top and bottom and one of the left and right set to true, this will be fixed.

      1. label (object)

         Contains 2 items:

         1. display (boolean), default: `false`

            Decides whether or not to display the axis's label - currently this has to be displayed if the axis is, this will be fixed.

         1. text (string), default: `''`

            Contains the text to display as the axis's label, if it is not an empty string and `options.chart.axes.<bottom|left|top|right>.lael.display` is set to `true`, it will provide a `<text>` element with the class of `axis-label` for styling with CSS. Other attributes will be `dy="1em"`, `text-anchor="middle"` and `x` and `y` which the library will calculate.

   1. margin (object)

      Contains 4 items: `top`, `right`, `bottom` and `left`, each of which defaults to `10` and provides a margin around your visualisation so that it can be visually separate from the rest of the elements.

1. description (string), default: `''`

   Provides a description of your visualisation to assistive technologies such as screen readers.

1. id (string), defaut: `''`

   Adds an ID to the parent SVG. **Please include an ID**

1. legend (object)

   If the legend is set to display, then it will build and display the legend on your chart as dtermined by the below options. It add a `<g>` element with the id and the class `legend`, containing a list of `<g>` elements with the class `legend-item`. Each of these `g.legenditem`s contains a shape (`<rect>` is the default) with the class `legend-item-icon`, dependent on the options, and a `<text>` element with the class `legend-item-text`.

   Contains 12 items:

   1. background (object)

      Contains 1 item:

      1. display (boolean), default: `false`

         Decides whether or not to add a background to the legend. If it is set to true it will add a `<rect>` element with the class `legend-background` for styling with CSS.

   1. displaceTitle (boolean), default: `false`

      Decides whether the placement of the legend should have an effect on the positioning of the title and subtitle. If it set to true then if `options.legend.position` is set to `top-left`, `left`, `bottom-left`, `top-right`, `right` or `bottom-right` and the `options.legend.orientation` is set to `vertical` then the title and subtitle will shift (and possibly wrap) into their new smaller container.

      If `options.legend.position` is set to `top` or `bottom` or `options.legend.orientation` is set to `horizontal` then this option is ignored.

   1. display (boolean), default: `false`

      Decides whether or not to display the legend.

   1. icons (object)

      Provides a default for the icons contained in each legend item.

      Contains 4 items:

      1. display (boolean), default: `false`

         Determines whether to display an icon.

      1. height (integer), default: `14`

         Determines the height of the icons in pixels.

         **N.B.** The `height` property is only applicable to certain SVG elements, in this case the `shape` beneath this defaults to `rect` which takes a height property.

      1. shape (string), default: `'rect'`

         Determines the shape that the icons should take.

      1. width (integer), default: `14`

         Determines the width of the icons in pixels.

         **N.B.** The `width` property is only applicable to certain SVG elements, in this case the `shape` above this defaults to `rect` which takes a width property.

   1. itemMargin (object)

      Contains 4 items: `top`, `right`, `bottom` and `left`, each of which defaults to `10` and provides a margin between each legend item to allow them to be visually separate from each other.

   1. items (array), default: `[]`

      An array of objects to be displayed on the legend. Each object must contain a `displayName` property which contains the text that will be displayed, this can either be a string or a function that returns a string. You may also want to include a `class` property to style the icons differently (different fill colours for example) with CSS.

      You can also include an `icon` property as an object, if you want to overwrite your default icon options set above.

      As you may be pulling in your legend items from a dataset containing many more properties, the library will simply ignore any additional properties.

      If this array is empty then the legend will not display.

   1. layOverChart (boolean), default: `false`

      Decides whether the legend should be displayed on top of the visualisation or resize the visualisation to fit.

   1. margin (object)

      Contains 4 items: `top`, `right`, `bottom` and `left`, each of which defaults to `10` and provides a margin around your legend so that it can be visually separate from the rest of the elements.

   1. orientation (string), default: `'vertical'`

      Decides whether your legend items should stack vertically on top of one another or horizontally next to each other.

   1. padding (object)

      Contains 4 items: `top`, `right`, `bottom` and `left`, each of which defaults to `0` and provides an inner padding so that your items are not squashed up to the edge of the legend's background.

      They default to `0` as a padding is only really recommended if you set `options.legend.background.display` to true.

   1. position (string), default: `'right'`

      Provides 8 options: `top-left`, `top`, `top-right`, `right`, `bottom-right`, `bottom`, `bottom-left`, `left` and decides where the legend should be on your SVG.

   1. title (string), default: `''`

      _Future update_

      Adds a title to the legend and provides a `<text>` element with the class `legend-title` for styling with CSS.

1. subtitle (object)

   Contains 3 items:

   1. display (boolean), default: `false`

      Determines whether to display a subtitle on the chart, if it is set to `true` and `options.subtitle.text` is not an empty string, it will provide a `<text>` element with the class of `chart-subtitle` for styling with CSS. Other attributes will be `dy="1em"`, `text-anchor="middle"` and `x` and `y` which the library will calculate. Should the subtitle be too long to fit onto a single line, the `<text>` element will contain 2 or more `<tspan>` elements.

   1. margin (object)

      Contains 4 items: `top`, `right`, `bottom` and `left`, each of which defaults to `10` and provides a margin around your subtitle so that it can be visually separate from the rest of the elements.

   1. text (string), default: `''`

      Contains the text to display as the subtitle, if it is not an empty string and `options.subtitle.display` is set to `true`, it will provide a `<text>` element with the class of `chart-subtitle` for styling with CSS. Other attributes will be `dy="1em"`, `text-anchor="middle"` and `x` and `y` which the library will calculate. Should the subtitle be too long to fit onto a single line, the `<text>` element will contain 2 or more `<tspan>` elements.

1. target (string), default: `''` **REQUIRED**

   Targets the container `<div>` or `<section>` where your visualisation is to be displayed. Will throw an error is either left blank or the target element does not exist.

   Can target either an element's ID or its querySelector.

1. title (object)

   **Please include a title**

   Contains 3 items:

   1. display (boolean), default: `false`

      Determines whether to display a title on the chart, if it is set to `true` and `options.title.text` is not an empty string, it will provide a `<text>` element with the class of `chart-title` for styling with CSS. Other attributes will be `dy="1em"`, `text-anchor="middle"` and `x` and `y` which the library will calculate. Should the title be too long to fit onto a single line, the `<text>` element will contain 2 or more `<tspan>` elements.

   1. margin (object)

      Contains 4 items: `top`, `right`, `bottom` and `left`, each of which defaults to `10` and provides a margin around your subtitle so that it can be visually separate from the rest of the elements.

   1. text (string), default: `''`

      Contains the text to display as the title, if it is not an empty string and `options.title.display` is set to `true`, it will provide a `<text>` element with the class of `chart-title` for styling with CSS. Other attributes will be `dy="1em"`, `text-anchor="middle"` and `x` and `y` which the library will calculate. Should the title be too long to fit onto a single line, the `<text>` element will contain 2 or more `<tspan>` elements.

      If it is not an empty string then, regardless of whether `options.title.display` is true, it will add a `<title>` element to your SVG to allow assistvie technologies such as screenreaders to see it.
