"use strict";

$(document).ready(function() {
   if (window.localStorage && localStorage.initialinput && localStorage.finaloutput)
   {
    out.className = 'unhidden';
    initialinput.innerHTML = localStorage.initialinput;
    finaloutput.innerHTML = localStorage.finaloutput;
   }
   
   
   var dropZone = document.getElementById('fileinput');
   dropZone.addEventListener('dragover', handleDragOver, false);
   dropZone.addEventListener('drop', handleFileSelect, false);
   $("#fileinput").change(calculate);
});



// main
function calculate(evt) {
  var f = evt.target.files;

  if (f) {
    var r = new FileReader();
    r.onload = function(e) {
      var contents = e.target.result;
      
      var tokens = lexer(contents);
      var pretty = tokensToString(tokens);
      
      out.className = 'unhidden';
      initialinput.innerHTML = contents;
      finaloutput.innerHTML = pretty;
      
      
      if (window.localStorage)
      {
	  localStorage.initialinput = contents;
	  localStorage.finaloutput = pretty;
      }
    }
    r.readAsText(f);
  } else {
    alert("Failed to load file");
  }
}

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.
//calculate
    var f = evt.target.files;
    var output=[];
    for(var i=0, f; f=files[i]; i++){
	if (f) {
	    var r = new FileReader();
	    r.onload = function(e) {
	    var contents = e.target.result;
      
	    var tokens = lexer(contents);
	    var pretty = tokensToString(tokens);
      
out.className = 'unhidden';
initialinput.innerHTML = contents;
finaloutput.innerHTML = pretty;

if (window.localStorage)
{
localStorage.initialinput = contents;
localStorage.finaloutput = pretty;
}
}


r.readAsText(f);
output.push(r);
} else {
alert("Failed to load file");
}
}


  }

  function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
}

function tokensToString(tokens) {
   var r = '';
   for(var i in tokens) {
     var t = tokens[i];
     var s = JSON.stringify(t, undefined, 2);
     s = _.template(externScript.innerHTML, {token: t, match: s});
     r += s;
   }
   return '<ol>\n'+r+'</ol>';
}

function lexer(input) {
  var blanks = /^\s+/;
  var iniheader = /^\[([^\]\r\n]+)\]/;
  var comments = /^[;#](.*)/;
  var nameEqualValue = /^([^=;\r\n]+)=([^;\r\n]*)/;
  var any = /^(.|\n)+/;

  var out = [];
  var m = null;

  while (input != '') {
    if (m = blanks.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type : 'blanks', match: m });
    }
    else if (m = iniheader.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'header', match: m });
    }
    else if (m = comments.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'comments', match: m });
    }
    else if (m = nameEqualValue.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'nameEqualValue', match: m });
    }
    else if (m = any.exec(input)) {
      out.push({ type: 'error', match: m });
      input = '';
    }
    else {
      alert("Fatal Error!"+substr(input,0,20));
      input = '';
    }
  }
  return out;
}