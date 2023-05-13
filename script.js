const text = "emmanpbarrameda;";
let i = 0;

function type() {
  if (i < text.length) {
    document.getElementById("typing-myname").innerHTML += text.charAt(i);
    i++;
    setTimeout(type, 100);
  } else {
    setTimeout(function() {
      i = 0;
      document.getElementById("typing-myname").innerHTML = "";
      type();
    }, 2000);
  }
}

window.onload = function() {
  type();
};
