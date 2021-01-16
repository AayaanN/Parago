//var saveNote = document.querySelector('#save-note');
//var deleteNotes = document.querySelector('#delete-notes');
//var notesField = document.querySelector('#note-value');
var start = document.querySelector('#start-timer');
var skip = document.querySelector('#skip-timer');
var workPeriod = true;
var switchTime = true;
var minute = 24;
var sec = 59;
// // Populate Notes From Page
// chrome.tabs.query({
//   active: true,
//   lastFocusedWindow: true
// }, tabs => {
//   let url = tabs[0].url;
//   let notesList = document.getElementById("notes");

//   // Grab the notes for the page
//   chrome.storage.local.get(url, notes => {
//     if (notes[url]) {
//       for (var i = 0; i < notes[url].length; i++) {
//         var li = document.createElement("li");
//         li.appendChild(document.createTextNode(notes[url][i]));
//         notesList.appendChild(li);
//       }
//     }
//   });
// });

// notesField.focus();

// // Delete Notes
// deleteNotes.onclick = function () {
//   chrome.tabs.query({
//     active: true,
//     lastFocusedWindow: true
//   }, tabs => {
//     let url = tabs[0].url;
//     chrome.storage.local.get(url, notes => {
//       notes[url] = []
//       chrome.storage.local.set(notes);
//       chrome.tabs.sendMessage(tabs[0].id, {notes: notes[url], action: "clear"}, _ => {
//         console.log("Cleared page");
//         location.reload();
//       });
//     });
//   });
// }

// // Save Note
// saveNote.onclick = function () {
//   chrome.tabs.query({
//     active: true,
//     currentWindow: true
//   }, function (tabs) {
//     // Something
//     let url = tabs[0].url;
//     let note = notesField.value;
//     chrome.storage.local.get(url, notes => {
//       if (notes[url])
//         notes[url].push(note);
//       else
//         notes[url] = [note];
//       chrome.tabs.sendMessage(tabs[0].id, {notes: [note], action: "add"}, _ => {
//         console.log("Added Note: '"+ note);
//       });
//       chrome.storage.local.set(notes);
//     });
//   });
//   location.reload();
// };

if (switchTime == true){
  start.onclick = function() {
    // var minute = 24;
    // var sec = 59;
    setInterval(function() {
      document.getElementById("timer").innerHTML = minute + " : " + sec;
      sec--;
      if(minute==0 && sec == 00 && workPeriod==true){
        minute = 4;
        sec = 59;
      }
      else if(minute==0 && sec == 00 && workPeriod==false){
        minute = 24;
        sec = 59;
      }
      else if (sec == 00) {
        minute --;
        sec = 59;
      }
    }, 1000);
  }
}

skip.onclick = function() {
  if (switchTime == true){
    switchTime = false;
    console.log("Switch time = true");
  }
  else if (switchTime == false){
    minute = 4;
    sec = 59;
    document.getElementById("timer").innerHTML = minute + " : " + sec;
    console.log("while loop");
    switchTime = true;
    console.log("Switch time = false");
  }
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