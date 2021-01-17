var saveNote = document.querySelector('#save-note');
var deleteNotes = document.querySelector('#delete-notes');
var notesField = document.querySelector('#notes_textarea');
//
var start = document.querySelector('#start-timer');
var skip = document.querySelector('#skip-timer');
var saveNoteButton = document.querySelector('#save-note');
var workPeriod = true;
var page = 1;
var minute = 24;
var sec = 59;

// !!! STORAGE CODE --> WORK IN PROGRESS

function storeTasks(key, value) {
  chrome.storage.sync.get(key, function(data) {
    if (typeof data[key] === 'undefined') {
      // this is where we were unsure about the typo --> does this mean in or not in storage??
      //    we're currently going with it means NOT in storage
      var map1 = {};
      map1[key] = value;
      chrome.storage.sync.set(map1, function() {
        console.log(value + " was saved for " + key);
      });
    } else {
      console.log("made it to else statement!!");
      //chrome.storage.sync.get(key, function(data) {
        preValue =  data[key];
        console.log("preValue " + preValue);
        var map2 = {};
        map2[key] = (value + preValue);
        console.log("map2 " + map2[key]);
        chrome.storage.sync.set(map2, function() {
          console.log(value+preValue + " was saved for " + key);
        });
     // });
    }
  });
};

//var globalTaskList = new Map();
var globalTaskList = {};

function getData() {
  // inputting null gets it to return all keys??
  var allKeys = chrome.storage.sync.get(null, function(items) {
    /*
    console.log("hi");
    return Object.keys(items);
    */
    console.log("items: ");
    console.log(items);
    var allKeys = Object.keys(items);
    console.log("allKeys " + allKeys + " " + allKeys.length);

    for (var i = 0; i < allKeys.length; i++) {
      console.log("big for loop");
      console.log(allKeys[i]);
      console.log(items[allKeys[i]]);
      globalTaskList[allKeys[i]] = items[allKeys[i]];
      //globalTaskList.set(allKeys[i], items[allKeys[i]])
    }
    //return items;
  });
  //console.log("ALLKEYS");
  //console.log(allKeys);
  //return allKeys;
  //console.log("allKeys " + allKeys);
};

storeTasks("sleep", 25);
storeTasks("hello", 25);


//---------------------------------- alarm stuff
function alarmAlert(){
  var myAudio = new Audio();
  myAudio.src = "alert.mp3"
  myAudio.play();
}
//---------------------------------- Timer Stuff
if (page == 1){
  start.onclick = function() {
    // var minute = 24;
    // var sec = 59;
    setInterval(function() {
      document.getElementById("timer").innerHTML = minute + " : " + sec;
      sec--;
      if(minute==0 && sec == 00 && page == 1){
        alarmAlert();
        minute = 4;
        sec = 59;
        // document.getElementById("save-note").style.display = "none";

        page = 2;
      }
      else if(minute==0 && sec == 00 && page == 2){
        var element = document.getElementById("notes_textarea");
        element.classList.add("notes_visible");

        var myDiv=document.getElementById('timer');
        myDiv.style.display = 'none';

        var text_popup = document.getElementById("popup_message");
        text_popup.style.display = 'block';

        document.getElementById("start-timer").style.display = "none";
        document.getElementById("skip-timer").style.display = "none";
        // var saveNoteButton = document.getElementById("save-note");
        // element.classList.add("show");
        document.getElementById("save-note").className = 'show'; 

        page = 3;
      }
      // else if (page==3){
      //   minute = 24;
      //   sec = 59;
      //   page = 1;
      // }
      else if (sec == 00) {
        minute --;
        sec = 59;
      }
    }, 1000);
  }
}

skip.onclick = function() {
  if (page == 1){
    minute = 4;
    sec = 59;
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

    document.getElementById("start-timer").style.display = "none";
    document.getElementById("skip-timer").style.display = "none";
    // var saveNoteButton = document.getElementById("save-note");
    // element.classList.add("show");
    document.getElementById("save-note").className = 'show'; 

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

saveNoteButton.onclick = function() {
  console.log("save note was called!");
  let note = notesField.value;
  // here we manipulate note into a good format
  storeTasks(note, 25);

  document.getElementById("start-timer").style.display = "block";
  document.getElementById("skip-timer").style.display = "block";
  document.getElementById("save-note").className = 'hidden'; 

  document.getElementById("notes_textarea").className = 'notes_hidden'; 

  // var element = document.getElementById("notes_textarea");
  // element.classList.add("notes_hidden");

  var text_popup = document.getElementById("popup_message");
  text_popup.style.display = 'none';

  var myDiv=document.getElementById('timer');
  myDiv.style.display = 'block';

  minute = 24;
  sec = 59;
  document.getElementById("timer").innerHTML = minute + " : " + sec;

  page = 1;


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

  /*
  // Save Note
  saveNote.onclick = function () {
    console.log("save note was called!");
    let note = notesField.value;
    // here we manipulate note into a good format
    storeTasks(note, 25);

    
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
  */

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
  getData();
  console.log("globalTaskList");
  console.log(globalTaskList);
  //console.log("2");
  setTimeout(function() {dataVisFunc(globalTaskList)}, 500);
};

console.log("globalTaskList");
console.log(globalTaskList);
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

// MOVE THIS INTO TOGGLEVIS FUNCTION??

// dual "tab" feature for pomodoro and visualization

function dataVisFunc(data) {

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
  var data2 = {a: 9, b: 20, c:30, d:8, e:12, f:3, g:7, h:14}
  console.log("dummy data pls be the same")
  console.log(data2);
  //var data = ourTaskList;
  console.log("does it go till here?yay");
  console.log(data)
  //var data_obj = Object.fromEntries(ourTaskList);
  //console.log("datta entries :))");
  //console.log(data_obj)

  // set the color scale
  var color = d3.scaleOrdinal()
    //.domain(["a", "b", "c", "d", "e", "f", "g", "h"])
    //.domain(Object.keys(data))
    .domain(Object.getOwnPropertyNames(data))
    .range(d3.schemeSet2);

  console.log("test object.keys(data))")
  console.log(Object.keys(data));
  console.log("dummy data version")
  console.log(Object.keys(data2));
  console.log("test get own property names");
  console.log(Object.getOwnPropertyNames(data));
  console.log("DUMMY: test get own property names");
  console.log(Object.getOwnPropertyNames(data2));
  console.log("type of our data" + typeof data + "type of dummy" + typeof data2)

  //console.log(data);
  //console.log("data.keys()");

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .sort(null) // Do not sort group by size
    .value(function(d) {return d.value; })
  var data_ready = pie(d3.entries(data))
  console.log("d3 enties here!!")
  console.log(d3.entries(data));

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
      .style('fill', 'white')
  }
