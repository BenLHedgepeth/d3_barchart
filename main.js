
var request = 'https://raw.githubusercontent.com/FreeCodeCamp/'
request += 'ProjectReferenceData/master/GDP-data.json';

const margin = {
  top: 10,
  right: 50,
  bottom: 60,
  left: 50
};

const width = 900;
const innerWidth = width - margin.right - margin.left;
const height = 500;
const innerHeight= height - margin.top - margin.bottom;


function curate_label(bar) {
  const date = new Date(bar.attr("data-date"));
  const month = date.getUTCMonth() + 1;

  var quarter = (
    month >= 10 && month <= 12 ? 'Q4' :
    month >= 7 && month <= 9 ? 'Q3' :
    month >= 4 && month <= 6 ? 'Q2' : 'Q1'
  )
  return `<p>${date.getFullYear()} -
  ${quarter}<br />$${bar.attr('data-gdp')} billion</p>`

}


function show_tooltip(event) {
  const bar = d3.select(this);
  let [x, y] = d3.pointer(event);

  d3.select("#tooltip").node()
    .style.cssText = `top: ${innerHeight - 30};
    right: ${innerWidth - (x - 235)}; opacity: 0.6`;
  const content = curate_label(bar);
  d3.select("#tooltip").node().innerHTML = content;
}

function hide_tooltip(event) {
  d3.select('#tooltip').node()
    .style.cssText = "opacity: 0;"
}


const svg = d3.select(".contain").append('svg')
      .attr('width', width).attr('height', height);

const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);



d3.json(request).then((response) => {

  const dates = response.data.map((x) => new Date(x[0]));
  const gdp_values = response.data.map((x) => x[1]);

  const title = response.name.split(",")[0];
  const reference = response.description.split("\n")[2];

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
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('x', (d, i) => i * (innerWidth / response.data.length))
    .attr('y', (d) => yScale(d[1]))
    .attr('width', (d) => innerWidth / response.data.length)
    .attr('height', (d) => innerHeight - yScale(d[1]))
    .attr('class', 'bar');


  yAxis(g.append('g').attr("id", 'y-axis'));
  xAxis(
    g.append('g').attr('id', 'x-axis')
      .attr("transform", `translate(0, ${innerHeight})`)
  );

  const gTitle = svg.append('g')
      .attr(
        "transform",
        `translate(${margin.left + 15}, ${margin.top + 250}) rotate(270)`
      )
      .append("text").text(title)
      .style('font-size', '16px');

  const gDescription = svg.append('g')
      .attr(
        "transform",
        `translate(${width - innerWidth}, ${height - margin.bottom + 50})`
      )
      .append("text").text(reference)

  const rects = d3.selectAll('rect');
  rects.each(function(rect) {
    d3.select(this)
      .on('mouseover', show_tooltip)
      .on('mouseout', hide_tooltip)
  })

  const p = d3.select(".contain").append("p")
                  .attr("id", "tooltip")
                  .attr('class', "tipbox");

  const body = document.querySelector("body");
  window.addEventListener("load", () => console.log("Hello"))




})
