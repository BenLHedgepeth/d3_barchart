
var request = 'https://raw.githubusercontent.com/FreeCodeCamp/'
request += 'ProjectReferenceData/master/GDP-data.json';

const margin = {
  top: 30,
  right: 50,
  bottom: 30,
  left: 50
};

const width = 900;
const innerWidth = width - margin.right - margin.left;
const height = 500;
const innerHeight= height - margin.top - margin.bottom;

const svg = d3.select(".contain").append('svg')
      .attr('width', width).attr('height', height);

const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);



d3.json(request).then((response) => {

  const dates = response.data.map((x) => new Date(x[0]));
  const gdp_values = response.data.map((x) => x[1]);

  const xScale = d3.scaleTime(
    d3.extent(dates),
    [0, innerWidth]
  );

  const yScale = d3.scaleLinear(
    [0, d3.max(gdp_values)],
    [innerHeight, 0],
  )

  const yAxis = d3.axisLeft(yScale);
  const xAxis = d3.axisBottom(xScale);

  g.selectAll("rect")
    .data(response.data).enter().append('rect')
    .attr('data-date', (d) => d[0]).attr('data-gdp', (d) => d[1])
    .attr('x', (d, i) => i * (innerWidth / response.data.length))
    .attr('y', (d) => yScale(d[1]))
    .attr('width', (d) => innerWidth / response.data.length)
    .attr('height', (d) => innerHeight - yScale(d[1]))
    .attr('class', 'bar');

  const svg_rects = d3.selectAll("rect").nodes();
  svg_rects.forEach((rect) => {
    rect.append("title").attr('id', "tooltip").text(rect.attr("data-gdp"))
  })

  yAxis(g.append('g').attr("id", 'y-axis'));
  xAxis(
    g.append('g').attr('id', 'x-axis')
      .attr("transform", `translate(0, ${innerHeight})`)
  );


})
