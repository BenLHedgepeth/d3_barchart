
var request = 'https://raw.githubusercontent.com/FreeCodeCamp/'
request += 'ProjectReferenceData/master/GDP-data.json'

const svg_width = 900;
const svg_height = 500;

const margin = 50;
const margin_top = 10;

let svg = d3.select(".contain").append("svg")
            .attr("width", svg_width).attr("height", svg_height);

d3.json(request).then((response) => {

  //Define X axis
  let years = response.data.reduce(
    (accumulator, currentValue, i, array) => {
      let date = new Date(currentValue[0]).getFullYear();
      if (accumulator.indexOf(date) === -1) {
        accumulator.push(date);
      }
      return accumulator
    }, []
  );

  let xScale = d3.scaleLinear()
                  .domain(d3.extent(years))
                  .range(0, svg_width - margin);

  let xAxis = d3.axisBottom(xScale);
  svg.append("g")
      .attr("transform", `translate(${margin}, ${svg_height - margin})`)
      .call(xAxis)

  //Define scale and and axis of Y

  let gdp_values = response.data.map((gdp_data) => +gdp_data[1]);
  let yScale = d3.scaleLinear()
                  .domain([0, d3.max(gdp_values)])
                  .range([svg_height - margin, 0]);

  let g = svg.append("g").attr("transform", `translate(${margin}, ${margin_top})`)
  g.selectAll("rect")
    .data(gdp_values).enter().append("rect")
    .attr("width", (svg_width - margin) / gdp_values.length)
    .attr("height", (d) => (svg_height - margin) - yScale(d))
    .attr("x", (d, i) => i * ((svg_width - margin) / gdp_values.length))
    .attr('y', (d) => yScale(d))
    .attr("class", 'shade');

  let yAxis = d3.axisLeft(yScale);
  svg.append("g")
  .attr("transform", `translate(50, 10)`)
  .call(yAxis)

})
