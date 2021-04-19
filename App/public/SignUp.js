"use strict"
window.onload = () => {
  document.getElementById("next").addEventListener("click", () => {
    passwordMatch(event);
    validateDomain(event);
  });
};


function passwordMatch(e) {

	const password = document.querySelector('#password').value;
	const confirmPassword = document.querySelector('#confirmPassword').value;


	  if (confirmPassword === password){
	    console.log("Passwords Match");
	  }else{
	  	e.preventDefault();
      alert("Passwords do not match");
	    console.log("Passwords don't match");
	  }
} 

let domains = ["edu", "com", "org", "net", "gov"]; //update ur domains here

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