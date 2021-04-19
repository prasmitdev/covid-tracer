"use strict"
window.onload = () => {
  document.getElementById("SignUp").addEventListener("click", () => {
    validateDomain(event);

  });
  document.getElementById("NewMember").addEventListener("click", () => {
    validateDomain(event);
    
  });
};


let domains = ["edu", "com", "org", "net"]; //update ur domains here

function validateDomain(e) {
  let idx1 = document.getElementById("Email").value.indexOf("@");

  if (idx1 > -1) {
    let splitStr = document.getElementById("Email").value.split("@");

    let sub = splitStr[1].split(".");

    let domainInput = domains.filter((domain) => domain === sub[1]);
    if (domainInput.length > 0) {
      console.log(domainInput);
    } else {
      alert("Enter appropriate Email Address");
      e.preventDefault();
    }
  }
}