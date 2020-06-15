      var country1Default = "Turkey";
      var country2Default = "Switzerland";
      var country3Default =  "Italy"
      function fetchData(url) {
        return fetch(url).then((response) => {
          if (response.status != 200) {
            throw new Error(`Statut de réponse inattendu: ${response.status}`);
          } else {
            return response.json();
          }
        });
      }
      function downloadData() {
        var primaryDataUrl = "https://coronavirus-tracker-api.herokuapp.com/all";
        var backupDataUrl = "https://gentle-peak-51697.herokuapp.com/all";
        return fetchData(primaryDataUrl).catch((error) => {
          console.log(error);
          console.warn(`Échec de la récupération des données de l'API principale (${primaryDataUrl})  (${backupDataUrl}).`);
          return fetchData(backupDataUrl).catch((error) => {
            console.log(error);
            console.error(`La récupération des données a échoué.`);
          });
        });
      }

      function setupSelections(covidChard, rawData) {
        var confirmedRadio = document.getElementById("confirmed");
        var deathsRadio = document.getElementById("deaths");
        var country1Select = document.getElementById("country1");
        var country2Select = document.getElementById("country2");
        var country3Select = document.getElementById("country3");
        var addChangeListener = (element) => {
          element.addEventListener("change", (event) => {
            updateChart(covidChard, rawData, country1Select, country2Select,country3Select);
          });
        };

        addChangeListener(confirmedRadio);
        addChangeListener(deathsRadio);

        var countries = rawData.confirmed.locations
          .filter((l) => !l.province)
          .map((l) => l.country)
          .sort((a, b) => a.localeCompare(b));

        for (let countryName of countries) {
          var el = document.createElement("option");
          el.textContent = countryName;
          el.value = countryName;
          var el2 = el.cloneNode(true);
          var el3 = el.cloneNode(true);
          //  var e2 = document.createElement("option");
          // e2.textContent = countryName;
          //  e2.value = countryName;
          //  var el3 = e1.cloneNode(true);
          // var el3 = e2.cloneNode(true);



          
          if (el.value == country1Default) {
            el.setAttribute("selected", "selected");
          }

          if (el2.value == country2Default) {
            el2.setAttribute("selected", "selected");
          }
          if (el3.value == country3Default) {

            el3.setAttribute("selected", "selected");
          }



          country1Select.appendChild(el);
          country2Select.appendChild(el2);
          country3Select.appendChild(el3);
        }

        addChangeListener(country1Select);
        addChangeListener(country2Select);
        addChangeListener(country3Select);
        return { country1Select, country2Select,country3Select };
      }



      function setupChart() {
        // les dimensions de chart
        var margin = { top: 30, right: 150, bottom: 30, left: 50 },
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;
        var containerWidth = width + margin.left + margin.right,
          containerHeight = height + margin.top + margin.bottom;

        // les ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // ajouter l'objet de SVG
        var svg = d3
          .select(".chart")
          .classed("svg-container", true)
          .append("svg")
          .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        return { svg, x, y, width, height };
      } 
// buraya fonksiyonlar
                    
  function make_x_gridlines() {		
    return d3.axisBottom(x)
        .ticks(5)
  }
  

  function make_y_gridlines() {		
    return d3.axisLeft(y)
        .ticks(5)
  }
  
//
      function gatherChartData(rawData, type, country1, country2, country3) {
        var sourceData = rawData[type];

        let maxDate = null;
        let maxCount = null;

        var countries = [country1, country2, country3].map((country) => {
          var countryData = sourceData.locations.find((d) => d.country == country && !d.province).history;
          var data = Object.keys(countryData)
            .map((k) => {
              var date = d3.timeParse("%m/%d/%y")(k);
              var count = +countryData[k];

              if (!maxDate || maxDate < date) {
                maxDate = date;
              }

              if (!maxCount || maxCount < count) {
                maxCount = count;
              }

              return { date, count };
            })
            .sort((a, b) => a.date - b.date);

          return { country, data };
        });

        var chartData = { maxDate, maxCount, countries };

        console.log(chartData);

        return chartData;
      }

      function renderData(covidChard, chartData) {
        
        d3.selectAll("g > *").remove();

        
        covidChard.x.domain(
          d3.extent(chartData.countries[0].data, function (d) {
            return d.date;
          })
        );
        covidChard.y.domain([0, chartData.maxCount]);

        
        for (let i = 0; i < chartData.countries.length; i++) {
          var countryData = chartData.countries[i].data;

        
          var line = d3
            .line()
            .x(function (d) {
              return covidChard.x(d.date);
            })
            .y(function (d) {
              return covidChard.y(d.count);
            });

        
          covidChard.svg
            .append("path")
            .data([countryData])
            .attr("class", `line country${(i + 1).toString()}`)
            .attr("d", line);
            
          
          covidChard.svg
            .append("text")
            .attr("transform", "translate(" + (covidChard.width + 3) + "," + covidChard.y(countryData[countryData.length - 1].count) + ")")
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .attr("class", `legend country${(i + 1).toString()}`)
            .text(`${chartData.countries[i].country} (${chartData.countries[i].data[chartData.countries[i].data.length - 1].count.toLocaleString()})`);
        }
       
        covidChard.svg
          .append("g")
          .attr("transform", "translate(0," + covidChard.height + ")")
          .call(d3.axisBottom(covidChard.x))
           

    
        covidChard.svg.append("g").call(d3.axisLeft(covidChard.y));
        
      }
        
//////////

      function updateChart(covidChard, rawData, country1Select, country2Select, country3Select) {
        var type = document.querySelector('input[name="type"]:checked').value;
        var country1 = country1Select.options[country1Select.selectedIndex].value;
        var country2 = country2Select.options[country2Select.selectedIndex].value;
        var country3 = country3Select.options[country3Select.selectedIndex].value; 
        var chartData = gatherChartData(rawData, type, country1, country2, country3);

        renderData(covidChard, chartData);
      }

      document.addEventListener("DOMContentLoaded", (event) => {
        downloadData().then((rawData) => {
          var covidChard = setupChart();
          var { country1Select, country2Select, country3Select } = setupSelections(covidChard, rawData);

          
          updateChart(covidChard, rawData, country1Select, country2Select, country3Select);

          document.body.classList.add("loaded");   

    }
        );
      });
    