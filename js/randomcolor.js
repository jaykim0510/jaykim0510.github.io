// var color = ["red", "blue", "yellow", "green"];

// document.addEventListener("DOMContentLoaded", function (event) {
//     start()
// });


// function start() {
//     document.getElementsByClassName("post_tag_list").style.backgroundColor = "yellow";
// }


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  
  
  function setRandomColor() {
    $(".post_tag_list").css("background-color", getRandomColor());
  }