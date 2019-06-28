<template>
  <div class="hello">
    <!-- <h1>{{ msg }}</h1> -->
    <p>This is the {{ counter }} user.</p>
    <button v-on:click="lastfunc">Last</button>
    <button v-on:click="nextfunc">Next</button>
    <button v-on:click="redrawfunc">ReDraw</button>
    <svg class="traceView"></svg>
    <p>{{ timeReminder }}</p>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'TraceView',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      timeReminder: "",
      jsonData: null,
      traceSVG: null,
      svgWidth: null,
      svgHeight: null,
      counter: 0,
      maxUser: 2,
    }
  },
  mounted () {
    this.initialize();
    this.loadJSON(this.drawTraceView);
    
  },
  methods: {
    initialize() {
      this.svgWidth = 960;
      this.svgHeight = 600;
      this.traceSVG = d3.select('.traceView').attr('width', this.svgWidth).attr('height', this.svgHeight);
    },
    loadJSON(callback) {   
      let xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', './static/data/example.json', true);
      xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
          callback(xobj.responseText);
        }
      };
      xobj.send(null);  
    },
    drawTraceView(data){

      // Compute data as json format
      this.jsonData = JSON.parse(data)

      let xScale = d3.scaleLinear().range([0, this.svgWidth]).domain([0, 960]);
      let yScale = d3.scaleLinear().range([0, this.svgHeight]).domain([0, 600]);
      let drawLine = d3.line()
        .x(function(d) {
          if(d.length > 2) {
            return xScale(d[0]);
          }    
        })
        .y(function(d) {
          if(d.length > 2) {
            return yScale(d[1]);
          }
        })
      this.maxUser = this.jsonData.length
      
      // Draw Trace Path
      for(let i = 1; i < this.jsonData[this.counter].length - 2; i++) {
        let tracePath = this.traceSVG.append('path')
          .attr('class', 'tracePath')
          .datum(this.jsonData[this.counter].slice(i,i+2))
          .attr('d' , drawLine)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 2)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round");

        // Variable to Hold Total Length
        let totalLength = tracePath.node().getTotalLength();
        
        // Set Properties of Dash Array and Dash Offset and initiate Transition
        tracePath
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition() // Call Transition Method
          .delay(this.jsonData[this.counter][i][4] - this.jsonData[this.counter][1][4])
          .duration(this.jsonData[this.counter][i+1][4] - this.jsonData[this.counter][i][4]
            // function () {
            //   if(this.jsonData[this.counter][i+1][4] - this.jsonData[this.counter][i][4] > 1000*30) {
            //     this.timeReminder = "The gap time over 30s"
            //     return parseInt(30000)
            //   } else {
            //     this.timeReminder = ""
            //     return this.jsonData[this.counter][i+1][4] - this.jsonData[this.counter][i][4]
            //   } 
            // }
          ) // Set Duration timing (ms)
          .ease(d3.easeLinear) // Set Easing option
          .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition
      }

    },
    lastfunc: function(event) {
      d3.selectAll('.tracePath').remove('*');
      if(this.counter > 0) {
        this.counter -= 1;
      }
      this.initialize();
      this.loadJSON(this.drawTraceView);
    },
    nextfunc: function(event) {
      d3.selectAll('.tracePath').remove('*');
      if(this.counter < this.maxUser - 1){
        this.counter += 1;
      }
      this.initialize();
      this.loadJSON(this.drawTraceView);
    },
    redrawfunc: function(event) {
      d3.selectAll('.tracePath').remove('*');
      this.initialize();
      this.loadJSON(this.drawTraceView);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
