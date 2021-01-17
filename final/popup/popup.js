var saveNote = document.querySelector('#save-note');
var deleteNotes = document.querySelector('#delete-notes');
var notesField = document.querySelector('#note-value');
//
var start = document.querySelector('#start-timer');
var skip = document.querySelector('#skip-timer');
var workPeriod = true;
var page = 1;
var minute = 24;
var sec = 59;
//---------------------------------- Timer Stuff

if (page == 1){
  start.onclick = function() {
    // var minute = 24;
    // var sec = 59;
    setInterval(function() {
      document.getElementById("timer").innerHTML = minute + " : " + sec;
      sec--;
      if(minute==0 && sec == 00 && page == 1){
        minute = 4;
        sec = 59;
        page = 2;
      }
      else if(minute==0 && sec == 00 && page == 2){
        var element = document.getElementById("notes_textarea");
        element.classList.add("notes_visible");

        var myDiv=document.getElementById('timer');
        myDiv.style.display = 'none';
      }
      else if (page==3){
        minute = 24;
        sec = 59;
        page = 1;
      }
      else if (sec == 00) {
        minute --;
        sec = 59;
      }
    }, 1000);
  }
}

skip.onclick = function() {
  if (page == 1){
    minute = 0;
    sec = 03;
    document.getElementById("timer").innerHTML = minute + " : " + sec;
    page = 2;
    console.log(page);
  }
  else if (page == 2){
    var element = document.getElementById("notes_textarea");
    element.classList.add("notes_visible");

    var text_popup = document.getElementById("popup_message");
    text_popup.style.display = 'block';

    var myDiv=document.getElementById('timer');
    myDiv.style.display = 'none';
    // minute = 24;
    // sec = 59;
    // document.getElementById("timer").innerHTML = minute + " : " + sec;
    // console.log("while loop");
    page = 3;
    console.log(page);
  }
  else if(page ==3){
    // var element = document.getElementById("notes_textarea");
    // element.classList.add("notes_visible");
    // page=1
  }
}

//---------------------------------- Note Stuff
// // Populate Notes From Page
if (page == 3){
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, tabs => {
    let url = tabs[0].url;
    let notesList = document.getElementById("notes");

    // Grab the notes for the page
    chrome.storage.local.get(url, notes => {
      if (notes[url]) {
        for (var i = 0; i < notes[url].length; i++) {
          var li = document.createElement("li");
          li.appendChild(document.createTextNode(notes[url][i]));
          notesList.appendChild(li);
        }
      }
    });
  });

  notesField.focus();

  // Delete Notes
  deleteNotes.onclick = function () {
    chrome.tabs.query({
      active: true,
      lastFocusedWindow: true
    }, tabs => {
      let url = tabs[0].url;
      chrome.storage.local.get(url, notes => {
        notes[url] = []
        chrome.storage.local.set(notes);
        chrome.tabs.sendMessage(tabs[0].id, {notes: notes[url], action: "clear"}, _ => {
          console.log("Cleared page");
          location.reload();
        });
      });
    });
  }
  // Save Note
  saveNote.onclick = function () {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      // Something
      let url = tabs[0].url;
      let note = notesField.value;
      chrome.storage.local.get(url, notes => {
        if (notes[url])
          notes[url].push(note);
        else
          notes[url] = [note];
        chrome.tabs.sendMessage(tabs[0].id, {notes: [note], action: "add"}, _ => {
          console.log("Added Note: '"+ note);
        });
        chrome.storage.local.set(notes);
      });
    });
    location.reload();
  };

}
// while (switchTime == false){
//   minute = 4;
//   sec = 59;
//   document.getElementById("timer").innerHTML = minute + " : " + sec;
//   console.log("while loop");
  // if (workPeriod == false){
  //   minute = 24;
  //   sec = 59;
  // }
  // else if(workPeriod == true){
  //   minute = 4;
  //   sec = 59;
  // }
//}




// !!! BELOW IS TOGGLING BETWEEN PAGES STUFF !!!
var toggleTimer = document.querySelector('#btn-timer');
var toggleVis = document.querySelector('#btn-vis');

document.getElementById("timer-page").style.display = "block";
document.getElementById("timeVis").style.display = "none";

toggleTimer.onclick = function() {
  document.getElementById("timer-page").style.display = "block";
  document.getElementById("timeVis").style.display = "none";
  console.log("1");
};
toggleVis.onclick = function() {
  document.getElementById("timer-page").style.display = "none";
  document.getElementById("timeVis").style.display = "block";
  console.log("2");
};


  /*
  if(document.getElementById('btn-timer').checked) { 
    document.getElementById("timer-page").style.display = "block";
    document.getElementById("timeVis").style.display = "none";
    console.log("1");
  } else if(document.getElementById('btn-vis').checked) { 
    document.getElementById("timeVis").style.display = "block";
    document.getElementById("timer-page").style.display = "none";
    console.log("2");
  } else { 
    document.getElementById("timer-page").style.display = "block";
    document.getElementById("timeVis").style.display = "none";
    console.log("3");
  } 
  */

/*
 if(document.getElementById("timer-page").style.display == "block") {
  document.getElementById("timer-page").style.display = "block";
  document.getElementById("timeVis").style.display = "none";
  console.log("1");
 } else if (document.getElementById("timeVis").style.display == "block") {
  document.getElementById("timer-page").style.display = "none";
  document.getElementById("timeVis").style.display = "block";
  console.log("2");
 }
 */

document.getElementById("btn-timer").addEventListener("click", display);
document.getElementById("btn-vis").addEventListener("click", display);

function display() {  
  
  
  
};

// !!! BELOW IS DATA VIS PART !!!
// dual "tab" feature for pomodoro and visualization


// set the dimensions and margins of the graph
var width = 300
    height = 300
    margin = 15

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin;

// append the svg object to 'timeVis' div in popup.html
var svg = d3.select("#timeVis")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
var data = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}

// set the color scale
var color = d3.scaleOrdinal()
  .domain(["a", "b", "c", "d", "e", "f", "g", "h"])
  .range(d3.schemeSet2);

// Compute the position of each group on the pie:
var pie = d3.pie()
  .sort(null) // Do not sort group by size
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data))

// The arc generator
var arc = d3.arc()
  .innerRadius(radius * 0.5)         // This is the size of the donut hole
  .outerRadius(radius * 0.8)

// Another arc that won't be drawn. Just for labels positioning
var outerArc = d3.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll('allSlices')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d){ return(color(d.data.key)) })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 1.0)

// Add the polylines between chart and labels:
svg
  .selectAll('allPolylines')
  .data(data_ready)
  .enter()
  .append('polyline')
    .attr("stroke", "white")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function(d) {
      var posA = arc.centroid(d) // line insertion in the slice
      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      var posC = outerArc.centroid(d); // Label position = almost the same as posB
      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

// Add the polylines between chart and labels:
svg
  .selectAll('allLabels')
  .data(data_ready)
  .enter()
  .append('text')
    .text( function(d) { console.log(d.data.key) ; return d.data.key } )
    .attr('transform', function(d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
    })
    .style('text-anchor', function(d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        return (midangle < Math.PI ? 'start' : 'end')
    })