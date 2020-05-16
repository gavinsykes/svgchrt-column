const SVGChrt = require('svgchrt');
const d3 = Object.assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'));

interface DataItem {
  key   : string;
  value : number;
}

let data: DataItem[] = [
  {
    key   : 'One',
    value : 1
  },
  {
    key   : 'Two',
    value : 2
  }
];

class SVGChrtColumn extends SVGChrt {
  plot() {
    const domains = {
      bottom : this.data, // callbacks like sort and map
      left   : [0, d3.max(data, d => d.value)]
    };
    const ranges = {
      bottom : [0, this.getChartArea().width],
      left   : [this.getChartArea().height, 0]
    };
    const scales = {
      bottom : d3.scaleBand().domain(domains.bottom).range(ranges.bottom).padding(0.1),
      left   : d3.scaleLinear().domain(domains.left).range(ranges.left).nice()
    };
    const axes = {
      bottom : d3.axisBottom(scales.bottom).ticks(domains.bottom.length),
      left   : d3.axisLeft(scales.left) // Callbacks like tickFormat
    };

    const bottomAxis = this.appendSVGChild('g', this.chartArea, {class: 'axis x-axis bottom-axis'});
    const leftAxis = this.appendSVGChild('g', this.chartArea, {class: 'axis y-axis bottom-axis'});
    const bottomAxisScale = this.appendSVGChild('g', bottomAxis, {class: 'axis-scale x-axis-scale bottom-axis-scale'});
    d3.select(bottomAxisScale).call(axes.bottom);
    const leftAxisScale = this.appendSVGChild('g', leftAxis, {class: 'axis-scale y-axis-scale left-axis-scale'});
    d3.select(leftAxisScale).call(axes.left);

    const axisLabels = {
      bottom : this.appendSVGChild('text', bottomAxis, {
        class         : 'axis-label x-axis-label bottom-axis-label',
        dy            : '1em',
        'text-anchor' : 'middle',
        transform     : `translate(0,${bottomAxisScale.getBBox().height + 4})`
      }, 'Bottom Label'),
      left   : this.appendSVGChild('text', leftAxis, {
        class         : 'axis-label y-axis-label left-axis-label',
        dy            : '1em',
        'text-anchor' : 'middle',
        transform     : `rotate(270)`
      }, 'Left Label')
    };
    leftAxisScale.setAttribute('transform', `translate(${axisLabels.left.getBBox().height + 4 + leftAxisScale.getBBox().width},0)`);

    ranges.bottom[0] = leftAxis.getBBox().width;
    ranges.left[1] = bottomAxis.getBBox().height;
    scales.bottom.range(ranges.bottom);
    scales.left.range(ranges.bottom);
    d3.select(bottomAxisScale).call(axes.bottom);
    d3.select(leftAxisScale).call(axes.left);

    axisLabels.bottom.setAttribute('transform', `translate(${(ranges.bottom[0] + ranges.bottom[1]) / 2},${bottomAxisScale.getBBox().height})`);
    axisLabels.left.setAttribute('transform', `translate(0,${(ranges.left[0] + ranges.left[1]) / 2}) rotate(270)`);

    bottomAxis.setAttribute('transform', `translate(0,${this.getChartArea().height - bottomAxis.getBBox().height})`);

    d3.select(this.chartArea)
      .selectAll('.column')
      .data(this.data)
      .enter()
      .append('g')
      .attr('tabindex',0)
      .attr('class','bar'); // Callbacks for things like data
    d3.selectAll('.column')
      .append('rect')
      .attr('fill','none')
      .attr('pointer-events','all')
      .attr('x', d => scales.bottom(d))
      .attr('y', ranges.left[1])
      .attr('width', scales.bottom.bandwidth())
      .attr('height', scales.left(0) - ranges.left[1]);
  }
}

module.exports = SVGChrtColumn; // Could use this in svgchrt to export the bits I and the user need to add stuff?
