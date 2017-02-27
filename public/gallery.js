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

// for (var i = 0; i < images.length; i++) {
//   images[i].addEventListener("click", function() {
//     showImage(images[i]);
//   });
// }




// for (var i=0, len=images.length, img; i<len; i++) {
//   img = images[i];
//     img.addEventListener("click", function() {
//       var src = img.getAttribute("src");
//       var desc = img.getAttribute("data-desc");
//       var title = img.getAttribute("data-title");
//
//       showImage(src, desc, title);
//     });
//     // img.addEventListener("click", function(e){
//     //   e.preventDefault();
//     //   document.getElementById('largeImg').src = img.src;
//     //   document.getElementById('imgTitle').append(img.getAttribute("data-title"));
//     //   document.getElementById('imgDesc').append(img.getAttribute("data-desc"));
//     // });
// }
//
// // for (var i = 0, img; i < images.length; i++) {
// //   img = images[i];
// //   img.onclick = function(e) {
// //     e.preventDefault();
// //     img.addEventListener("click", function() {
// //       var src = "/images/" + img.getAttribute("src");
// //       var desc = img.getAttribute("data-desc");
// //       var title = img.getAttribute("data-title");
// //       showImage(src, desc, title);
// //     });
// //   }
// // }

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
