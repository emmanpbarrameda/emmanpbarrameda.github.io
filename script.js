const name1 = "Emmanuel P. Barrameda";
const name2 = "emmanpbarrameda";
let i = 0;
let currentName = name1;

function type() {
  if (i < currentName.length) {
    document.getElementById("typing-myname").innerHTML += currentName.charAt(i);
    i++;
    setTimeout(type, 100);
  } else {
    setTimeout(function() {
      i = 0;
      document.getElementById("typing-myname").innerHTML = "";
      currentName = currentName === name1 ? name2 : name1;
      type();
    }, 2000);
  }
}




window.onload = function() {
  type();
};


