// ================ imports ===========================================================================================//

const mongoose = require("mongoose");

// ================ Field Validation ===========================================================================================//

const isValidField = function (value) {
  if (typeof value === "undefined" || value === null) return false;

  if (typeof value === "string" && value.trim().length === 0) return false;

  return true;
};

// ================ requestBody Validation ===========================================================================================//

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

// ================ Field Validation ===========================================================================================//

const isValidObjectId = function (ObjectId) {
  if (!mongoose.Types.ObjectId.isValid(ObjectId)) return false;

  return true;
};

// ================ Field Validation ===========================================================================================//

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) != -1;
};

// ================ URL Validation ===========================================================================================//

const isValidURL = function (link) {
  return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
    link
  );
};

// ================ Mobile No. Validation ===========================================================================================//

const isValidMobileNo = function (mobile) {
  return /((\+91)?0?)?[6-9]\d{9}$/.test(mobile);
};

// ================ Email Validation ===========================================================================================//

const isValidEmail = function (email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

// ================ Password Validation ===========================================================================================//

const isValidPassword = function (password) {
 
  regexpass = /^[A-Za-z\d@$!%*?&]{8,15}$/;
  return regexpass.test(password);
};

// ================ ISBN Validation ===========================================================================================//

const isValidISBN = function (ISBN) {
  if(ISBN.length != 10 && ISBN.length!=13){
    return false
  }
  if(ISBN.length == 13){
  if (/\d{13}/.test(ISBN)){
    return true
  }
  else{
    return false
  }
}
if(ISBN.length == 10){
  if(/^\d{9}[\dX]$/.test(ISBN)){
      return true
    }
  }
  else{
    false
  }
};

// ================ exports ===========================================================================================//

module.exports = {
  isValidField,
  isValidRequestBody,
  isValidEmail,
  isValidISBN,
  isValidMobileNo,
  isValidURL,
  isValidTitle,
  isValidObjectId,
  isValidPassword,
};
