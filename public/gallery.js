// Javascript for the Gallery page
// var fs = require('fs');
// var gallery = JSON.parse(fs.readFileSync('gallery.json'));

// var jQuery = require('jQuery');

var title = document.getElementById('gallery-title');
var images = document.getElementsByClassName("smallPic");
console.log(images);

title.onclick = function(e) {
  e.preventDefault();
  var form = document.getElementById('gallery-title-edit');
  if (form.style.display == 'block') {
    form.style.display = 'none';
  }
  else {
    form.style.display = 'block';
  }
};

function showImage(i) {
    document.getElementById('largeImg').src = images[i].getAttribute("src");
    document.getElementById('imgTitle').innerHTML = "<h2>" + images[i].getAttribute("data-title") + "</h2>";
    document.getElementById('imgDesc').innerHTML = images[i].getAttribute("data-desc");
    showLargeImagePanel();
    unselectAll();
}
function showLargeImagePanel() {
    document.getElementById('largeImgPanel').style.visibility = 'visible';
}
function unselectAll() {
    if(document.selection) document.selection.empty();
    if(window.getSelection) window.getSelection().removeAllRanges();
}
function hideMe(obj) {
    obj.style.visibility = 'hidden';
}
