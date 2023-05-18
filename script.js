const name1 = "I'm a Freelancer";
const name2 = "I'm a Student";
const name3 = "I'm a Desktop Developer";

let i = 0;
let currentName = name1;

function type() {
  if (i < currentName.length) {
    document.getElementById("profession").innerHTML += currentName.charAt(i);
    i++;
    setTimeout(type, 100);
  } else {
    setTimeout(function() {
      i = 0;
      document.getElementById("profession").innerHTML = "";
      if (currentName === name1) {
        currentName = name2;
      } else if (currentName === name2) {
        currentName = name3;
      } else {
        currentName = name1;
      }
      type();
    }, 2000);
  }
}

window.onload = function() {
  type();
};
