const d3 = Object.assign(
  {},
  require('d3-selection'),
  require('d3-scale'),
  require('d3-axis')
);

interface Datum<T> extends Record<string, T> {}

interface Points extends Record<string, unknown> {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

interface ChartArea extends Record<string, unknown> {
  height: number;
  points: Points;
  width: number;
}

interface SVGChrtType {
  appendSVGChild: (
    element: string,
    target: SVGElement | HTMLElement,
    attrs: Record<string, unknown>,
    text?: string
  ) =>
    | SVGElement
    | SVGDescElement
    | SVGGraphicsElement
    | SVGTextElement
    | SVGTitleElement;
  canvas: SVGElement;
  chartArea: SVGElement;
  getChartArea: () => ChartArea;
}

interface Scale extends Record<string, unknown> {
  type: string;
  base?: number;
  exponent?: number;
}

interface AxisLabel extends Record<string, unknown> {
  display: boolean;
  text: string;
}

interface Axis extends Record<string, unknown> {
  display: boolean;
  label: AxisLabel;
  scale: Scale;
}

interface Axes extends Record<string, unknown> {
  bottom: Axis;
  left: Axis;
  top: Axis;
  right: Axis;
}

interface Chart extends Record<string, unknown> {
  axes: Axes;
}

interface SettingsObject extends Record<string, unknown> {
  background: boolean;
  chart: Chart;
  description: string;
  id: string;
  target: string;
}

export default function plot(
  caller: SVGChrtType,
  settings: SettingsObject,
  data: Datum<unknown>[]
): void {
  const datasetsLength: number = Object.values(data[0]).length - 1;
  const domains = {
    bottom: settings.chart.axes.bottom.display
      ? data.map((c: Datum<unknown>) => Object.values(c)[0])
      : undefined,
    left: settings.chart.axes.left.display
      ? [
          d3.min(data, (d: Datum<number>) =>
            Math.min(...Object.values(d).slice(1))
          ) < 0
            ? settings.chart.type === 'stacked100'
              ? -1
              : settings.chart.type === 'stacked'
              ? d3.min(data, (d: Datum<number>) =>
                  Object.values(d)
                    .slice(1)
                    .reduce((a, b) => a - b, 0)
                )
              : d3.min(data, (d: Datum<number>) =>
                  Math.min(...Object.values(d).slice(1))
                )
            : 0,
          d3.max(data, (d: Datum<number>) =>
            Math.max(...Object.values(d).slice(1))
          ) > 0
            ? settings.chart.type === 'stacked100'
              ? 1
              : settings.chart.type === 'stacked'
              ? d3.max(data, (d: Datum<number>) =>
                  Object.values(d)
                    .slice(1)
                    .reduce((a, b) => a + b, 0)
                )
              : d3.max(data, (d: Datum<number>) =>
                  Math.max(...Object.values(d).slice(1))
                )
            : 0
        ]
      : undefined,
    top: settings.chart.axes.top.display
      ? data.map((c: Datum<unknown>) => Object.values(c)[0])
      : undefined,
    right: settings.chart.axes.right.display
      ? [
          d3.min(data, (d: Datum<number>) =>
            Math.min(...Object.values(d).slice(1))
          ) < 0
            ? settings.chart.type === 'stacked100'
              ? -1
              : settings.chart.type === 'stacked'
              ? d3.min(data, (d: Datum<number>) =>
                  Object.values(d)
                    .slice(1)
                    .reduce((a, b) => a - b, 0)
                )
              : d3.min(data, (d: Datum<number>) =>
                  Math.min(...Object.values(d).slice(1))
                )
            : 0,
          d3.max(data, (d: Datum<number>) =>
            Math.max(...Object.values(d).slice(1))
          ) > 0
            ? settings.chart.type === 'stacked100'
              ? 1
              : settings.chart.type === 'stacked'
              ? d3.max(data, (d: Datum<number>) =>
                  Object.values(d)
                    .slice(1)
                    .reduce((a, b) => a + b, 0)
                )
              : d3.max(data, (d: Datum<number>) =>
                  Math.max(...Object.values(d).slice(1))
                )
            : 0
        ]
      : undefined
  };
  const ranges = {
    x:
      domains.bottom || domains.top
        ? [0, caller.getChartArea().width]
        : [0,0],
    y:
      domains.left || domains.right
        ? [caller.getChartArea().height, 0]
        : [0,0]
  };
  const scales = {
    bottom: domains.bottom
      ? d3.scaleBand().domain(domains.bottom).range(ranges.x).padding(0.1)
      : undefined,
    left: domains.left
      ? settings.chart.axes.left.scale.type === 'log'
        ? d3
            .scaleLog()
            .base(settings.chart.axes.left.scale.base)
            .domain(domains.left)
            .range(ranges.y)
            .nice()
        : settings.chart.axes.left.scale.type === 'power'
        ? d3
            .scalePow()
            .exponent(settings.chart.axes.left.scale.exponent)
            .domain(domains.left)
            .range(ranges.y)
            .nice()
        : d3.scaleLinear().domain(domains.left).range(ranges.y).nice()
      : undefined,
    top: domains.top
      ? d3.scaleBand().domain(domains.top).range(ranges.x).padding(0.1)
      : undefined,
    right: domains.right
      ? settings.chart.axes.right.scale.type === 'log'
        ? d3
            .scaleLog()
            .base(settings.chart.axes.right.scale.base)
            .domain(domains.right)
            .range(ranges.y)
            .nice()
        : settings.chart.axes.right.scale.type === 'power'
        ? d3
            .scalePow()
            .exponent(settings.chart.axes.right.scale.exponent)
            .domain(domains.right)
            .range(ranges.y)
            .nice()
        : d3.scaleLinear().domain(domains.right).range(ranges.y).nice()
      : undefined
  };
  const axisFuncs = {
    bottom: scales.bottom
      ? d3
          .axisBottom(scales.bottom)
          .ticks(domains.bottom?.length)
          .tickFormat((d: string | number) =>
            d3.timeFormat('%b %Y')(new Date(d))
          )
      : undefined,
    left: scales.left
      ? d3
          .axisLeft(scales.left)
          .tickFormat(
            settings.type === 'stacked100'
              ? d3.format('.0%')
              : d3.format('$.1s')
          )
      : undefined,
    top: scales.top
      ? d3.axisTop(scales.top).ticks(domains.top?.length)
      : undefined,
    right: scales.right
      ? d3
          .axisRight(scales.right)
          .tickFormat(
            settings.type === 'stacked100'
              ? d3.format('.0%')
              : d3.format('$.1s')
          )
      : undefined
  };
  const axes = {
    bottom: axisFuncs.bottom
      ? (caller.appendSVGChild('g', caller.chartArea, {
          class: 'axis x-axis bottom-axis'
        }) as SVGGraphicsElement)
      : undefined,
    left: axisFuncs.left
      ? (caller.appendSVGChild('g', caller.chartArea, {
          class: 'axis y-axis left-axis'
        }) as SVGGraphicsElement)
      : undefined,
    top: axisFuncs.top
      ? (caller.appendSVGChild('g', caller.chartArea, {
          class: 'axis x-axis top-axis'
        }) as SVGGraphicsElement)
      : undefined,
    right: axisFuncs.right
      ? (caller.appendSVGChild('g', caller.chartArea, {
          class: 'axis y-axis right-axis'
        }) as SVGGraphicsElement)
      : undefined
  };
  const axisScales = {
    bottom: axes.bottom
      ? (caller.appendSVGChild('g', axes.bottom, {
          class: 'axis-scale x-axis-scale bottom-axis-scale'
        }) as SVGGraphicsElement)
      : undefined,
    left: axes.left
      ? (caller.appendSVGChild('g', axes.left, {
          class: 'axis-scale y-axis-scale left-axis-scale'
        }) as SVGGraphicsElement)
      : undefined,
    top: axes.top
      ? (caller.appendSVGChild('g', axes.top, {
          class: 'axis-scale x-axis-scale top-axis-scale'
        }) as SVGGraphicsElement)
      : undefined,
    right: axes.right
      ? (caller.appendSVGChild('g', axes.right, {
          class: 'axis-scale y-axis-scale right-axis-scale'
        }) as SVGGraphicsElement)
      : undefined
  };
  if (axisScales.bottom) {
    d3.select(axisScales.bottom).call(axisFuncs.bottom);
  }
  if (axisScales.left) {
    d3.select(axisScales.left).call(axisFuncs.left);
  }
  if (axisScales.right) {
    d3.select(axisScales.right).call(axisFuncs.right);
  }
  if (axisScales.top) {
    d3.select(axisScales.top).call(axisFuncs.top);
  }
  const axisLabels = {
    bottom:
      axes.bottom &&
      settings.chart.axes.bottom.label.display &&
      settings.chart.axes.bottom.label.text
        ? (caller.appendSVGChild(
            'text',
            axes.bottom,
            {
              'class': 'axis-label x-axis-label bottom-axis-label',
              'dy': '1em',
              'text-anchor': 'middle',
              'transform': `translate(0,${
                (axisScales.bottom?.getBBox().height ?? 0) + 4
              })`
            },
            settings.chart.axes.bottom.label.text
          ) as SVGGraphicsElement)
        : undefined,
    left:
      axes.left &&
      settings.chart.axes.left.label.display &&
      settings.chart.axes.left.label.text
        ? (caller.appendSVGChild(
            'text',
            axes.left,
            {
              'class': 'axis-label y-axis-label left-axis-label',
              'dy': '1em',
              'text-anchor': 'middle',
              'transform': `rotate(270)`
            },
            settings.chart.axes.left.label.text
          ) as SVGGraphicsElement)
        : undefined,
    right:
      axes.right &&
      settings.chart.axes.right.label.display &&
      settings.chart.axes.right.label.text
        ? (caller.appendSVGChild(
            'text',
            axes.right,
            {
              'class': 'axis-label y-axis-label right-axis-label',
              'dy': '1em',
              'text-anchor': 'middle',
              'transform': `rotate(270)`
            },
            settings.chart.axes.right.label.text
          ) as SVGGraphicsElement)
        : undefined,
    top:
      axes.top &&
      settings.chart.axes.top.label.display &&
      settings.chart.axes.top.label.text
        ? (caller.appendSVGChild(
            'text',
            axes.top,
            {
              'class': 'axis-label x-axis-label top-axis-label',
              'dy': '1em',
              'text-anchor': 'middle',
              'transform': `translate(0,${
                (axisScales.top?.getBBox().height ?? 0) + 4
              })`
            },
            settings.chart.axes.top.label.text
          ) as SVGGraphicsElement)
        : undefined
  };
  if (axisScales.bottom) {
    // Nada que hacer aqui, almenos no en este momento
  }
  if (axisScales.left) {
    axisScales.left?.setAttribute(
      'transform',
      `translate(${
        (axisLabels.left ? axisLabels.left.getBBox().height + axisScales.left.getBBox().width : 0) + 4
      },0)`
    );
  }
  if (axisScales.top) {
    axisScales.top.setAttribute(
      'transform',
      `translate(0,${
        (axisLabels.top ? axisLabels.top.getBBox().height + axisScales.top.getBBox().height : 0) + 4
      })`
    );
  }
  if (axisScales.right) {
    // Nada que hacer aqui, almenos no en este momento
  }

  if (axes.bottom) {
    if (axes.left || axes.right) {
      ranges.y[0] = caller.getChartArea().height - (axes.bottom.getBBox().height ?? 0);
      if (axes.left) {
        scales.left.range(ranges.y);
      }
      if (axes.right) {
        scales.right.range(ranges.y);
      }
    }
  }
  if (axes.left) {
    if (axes.top || axes.bottom) {
      ranges.x[0] = axes.left.getBBox().width;
      if (axes.top) {
        scales.top.range(ranges.x);
      }
      if (axes.bottom) {
        scales.bottom.range(ranges.x);
      }
    }
  }
  if (axes.top) {
    if (axes.left || axes.right) {
      ranges.y[1] =
        (axisLabels?.top?.getBBox().height + axisScales?.top?.getBBox().height ?? 0) + 4;
      if (axes.left) {
        scales.left.range(ranges.y);
      }
      if (axes.right) {
        scales.right.range(ranges.y);
      }
    }
  }
  if (axes.right) {
    if (axes.top || axes.bottom) {
      ranges.x[1] =
        caller.getChartArea().width -
        (axisLabels.right?.getBBox()?.height ?? 0) -
        4 -
        (axisScales.right?.getBBox()?.width ?? 0);
      if (axes.top) {
        scales.top.range(ranges.x);
      }
      if (axes.bottom) {
        scales.bottom.range(ranges.x);
      }
    }
  }

  if (axisScales.bottom) {
    d3.select(axisScales.bottom).call(axisFuncs.bottom);
    axisLabels.bottom.setAttribute(
      'transform',
      `translate(${(ranges.x[0] + ranges.x[1]) / 2},${
        axisScales.bottom.getBBox().height
      })`
    );
    axes.bottom.setAttribute('transform', `translate(0,${ranges.y[0]})`);
  }
  if (axisScales.left) {
    d3.select(axisScales.left).call(axisFuncs.left);
    axisLabels.left.setAttribute(
      'transform',
      `translate(0,${(ranges.y[0] + ranges.y[1]) / 2}) rotate(270)`
    );
  }
  if (axisScales.right) {
    d3.select(axisScales.right).call(axisFuncs.right);
    axisLabels.right.setAttribute(
      'transform',
      `translate(${axisScales.right.getBBox().width},${
        (ranges.y[0] + ranges.y[1]) / 2
      }) rotate(270)`
    );
    axes.right?.setAttribute('transform', `translate(${ranges.x[1]},0)`);
  }
  if (axisScales.top) {
    d3.select(axisScales.top).call(axisFuncs.top);
    axisLabels?.top?.setAttribute(
      'transform',
      `translate(${(ranges.x[0] + ranges.x[1]) / 2},0)`
    );
  }

  let hGridLineData = scales.right ? scales.right.ticks() : scales.left.ticks();
  if (axisScales.bottom) {
    hGridLineData = hGridLineData.slice(1);
  }
  if (axisScales.top) {
    hGridLineData.splice(-1);
  }
  let hGridLines = d3
    .select(caller.chartArea)
    .selectAll('.hgridline')
    .data(hGridLineData)
    .enter()
    .append('path')
    .attr('class', 'gridline hgridline')
    .attr(
      'd',
      (d: number) =>
        `M${ranges.x[0]} ${scales.right ? scales.right(d) : scales.left(d)} H${
          ranges.x[1]
        }`
    );
  const columns = d3
    .select(caller.chartArea)
    .selectAll('.column')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'column')
    .attr('tabindex', 0)
    .on('focus', () => {
      caller.canvas.classList.add('bars-hovered');
    })
    .on('blur', () => {
      caller.canvas.classList.remove('bars-hovered');
    });
  columns
    .append('title')
    .text(
      (d: Datum<unknown>) =>
        `${d3.timeFormat('%B %Y')(
          new Date(Object.values(d)[0] as string | number)
        )}\nTurnover: ${d3.format('$,.2f')(
          Object.values(d)[1]
        )}\nProfit: ${d3.format('$,.2f')(Object.values(d)[2])}`
    );
  columns
    .append('rect')
    .attr('pointer-events', 'all')
    .attr('fill', 'none')
    .attr('x', (d: Datum<unknown>) =>
      scales.top
        ? scales.top(Object.values(d)[0])
        : scales.bottom(Object.values(d)[0])
    )
    .attr('y', ranges.y[1])
    .attr(
      'width',
      scales.top ? scales.top.bandwidth() : scales.bottom.bandwidth()
    )
    .attr('height', ranges.y[0]);

  switch (settings.type) {
    case 'overlaid':
      for (let i = 0; i < datasetsLength; i++) {
        columns
          .append('rect')
          .attr('class', i === 0 ? 'turnover' : 'profit')
          .attr('fill', i === 0 ? '#61B0DC' : 'green')
          .attr('x', (d: Datum<unknown>) =>
            scales.top
              ? scales.top(Object.values(d)[0])
              : scales.bottom(Object.values(d)[0])
          )
          .attr('y', (d: Datum<number>) =>
            scales.right
              ? scales.right(Object.values(d)[i + 1]) > 0
                ? scales.right(Object.values(d)[i + 1])
                : scales.right(0)
              : scales.left(Object.values(d)[i + 1]) > 0
              ? scales.left(Object.values(d)[i + 1])
              : scales.left(0)
          )
          .attr(
            'width',
            scales.top ? scales.top.bandwidth() : scales.bottom.bandwidth()
          )
          .attr('height', (d: Datum<number>) =>
            scales.right
              ? Math.abs(
                  scales.right(0) - scales.right(Object.values(d)[i + 1])
                )
              : Math.abs(scales.left(0) - scales.left(Object.values(d)[i + 1]))
          );
        columns
          .append('text')
          .attr(
            'class',
            i === 0 ? 'column-label turnover' : 'column-label profit'
          )
          .attr('fill', i === 0 ? 'black' : 'white')
          .attr('text-anchor', 'middle')
          .attr('y', (d: Datum<number>) =>
            scales.right
              ? scales.right(Object.values(d)[i + 1]) +
                (scales.right(Object.values(d)[i + 1]) > 0 ? -10 : 10)
              : scales.left(Object.values(d)[i + 1]) +
                (scales.left(Object.values(d)[i + 1]) > 0 ? -10 : 10)
          )
          .attr('x', (d: Datum<unknown>) =>
            scales.top
              ? scales.top(Object.values(d)[0]) / 2
              : scales.bottom(Object.values(d)[0]) / 2
          )
          .text((d: Datum<number>) =>
            d3.format('$,.2f')(Object.values(d)[i + 1])
          );
      }
      break;
    case 'clustered':
      for (let i = 0; i < datasetsLength; i++) {
        columns
          .append('rect')
          .attr('class', i === 0 ? 'turnover' : 'profit')
          .attr('fill', i === 0 ? '#61B0DC' : 'green')
          .attr('x', (d: Datum<unknown>) =>
            scales.top
              ? scales.top(Object.values(d)[0]) +
                (scales.top.bandwidth() * i) / datasetsLength
              : scales.bottom(Object.values(d)[0]) +
                (scales.bottom.bandwidth() * i) / datasetsLength
          )
          .attr('y', (d: Datum<number>) =>
            scales.right
              ? scales.right(Object.values(d)[i + 1]) > 0
                ? scales.right(Object.values(d)[i + 1])
                : scales.right(0)
              : scales.left(Object.values(d)[i + 1]) > 0
              ? scales.left(Object.values(d)[i + 1])
              : scales.left(0)
          )
          .attr('width', scales.bottom.bandwidth() / datasetsLength)
          .attr('height', (d: Datum<number>) =>
            scales.right
              ? Math.abs(
                  scales.right(0) - scales.right(Object.values(d)[i + 1])
                )
              : Math.abs(scales.left(0) - scales.left(Object.values(d)[i + 1]))
          );
        columns
          .append('text')
          .attr(
            'class',
            i === 0 ? 'column-label turnover' : 'column-label profit'
          )
          .attr('fill', i === 0 ? 'black' : 'white')
          .attr('text-anchor', 'middle')
          .attr(
            'y',
            (d: Datum<number>) => scales.left(Object.values(d)[i + 1]) - 10
          )
          .attr(
            'x',
            (d: Datum<number>) =>
              scales.bottom(Object.values(d)[0]) + scales.bottom.bandwidth() / 2
          )
          .text((d: Datum<number>) =>
            d3.format('$,.2f')(Object.values(d)[i + 1])
          );
      }
      break;
    case 'stacked':
      for (let i = 0; i < datasetsLength; i++) {
        columns
          .append('rect')
          .attr('class', i === 0 ? 'turnover' : 'profit')
          .attr('fill', i === 0 ? '#61B0DC' : 'green')
          .attr('x', (d: Datum<number>) =>
            scales.top
              ? scales.top(Object.values(d)[0]) +
                (scales.top.bandwidth() * i) / datasetsLength
              : scales.bottom(Object.values(d)[0]) +
                (scales.bottom.bandwidth() * i) / datasetsLength
          )
          .attr('y', (d: Datum<number>) =>
            scales.left(
              Object.values(d)
                .slice(1, i + 2)
                .reduce((a, b) => a + b, 0)
            )
          )
          .attr('width', scales.bottom.bandwidth())
          .attr(
            'height',
            (d: Datum<number>) =>
              scales.left(
                Object.values(d)
                  .slice(1, i + 1)
                  .reduce((a, b) => a + b, 0)
              ) -
              scales.left(
                Object.values(d)
                  .slice(1, i + 2)
                  .reduce((a, b) => a + b, 0)
              )
          );
      }
    case 'stacked100':
      if (
        d3.max(data, (d: Datum<number>) =>
          Object.values(d)
            .slice(1)
            .reduce((a, b) => a + b, 0)
        ) > 0 &&
        d3.min(data, (d: Datum<number>) =>
          Object.values(d)
            .slice(1)
            .reduce((a, b) => a - b, 0)
        ) < 0
      ) {
        console.warn(
          `In a stacked100 type chart you must have all the data as either positive or negative`
        );
      }
      for (let i = 0; i < datasetsLength; i++) {
        columns
          .append('rect')
          .attr('class', i === 0 ? 'turnover' : 'profit')
          .attr('fill', i === 0 ? '#61B0DC' : 'green')
          .attr('x', (d: Datum<number>) =>
            scales.top
              ? scales.top(Object.values(d)[0]) +
                (scales.top.bandwidth() * i) / datasetsLength
              : scales.bottom(Object.values(d)[0]) +
                (scales.bottom.bandwidth() * i) / datasetsLength
          )
          .attr('y', (d: Datum<number>) => {
            let scale100 = d3
              .scaleLinear()
              .domain([
                0,
                Object.values(d)
                  .slice(1)
                  .reduce((a, b) => a + b, 0)
              ])
              .range([0, 1]);
            return scales.left(
              scale100(
                Object.values(d)
                  .slice(1, i + 2)
                  .reduce((a, b) => a + b, 0)
              )
            );
          })
          .attr('width', scales.bottom.bandwidth())
          .attr('height', (d: Datum<number>) => {
            let scale100 = d3
              .scaleLinear()
              .domain([
                0,
                Object.values(d)
                  .slice(1)
                  .reduce((a, b) => a + b, 0)
              ])
              .range([0, 1]);
            return (
              scales.left(
                scale100(
                  Object.values(d)
                    .slice(1, i + 1)
                    .reduce((a, b) => a + b, 0)
                )
              ) -
              scales.left(
                scale100(
                  Object.values(d)
                    .slice(1, i + 2)
                    .reduce((a: number, b: number) => a + b, 0)
                )
              )
            );
          });
      }
      break;
  }
}
