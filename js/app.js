
$(document).ready(function () {

  var selectedInputType = 'email';
  var selectEmailElement = $('.select-email');
  var selectPhoneElement = $('.select-phone');
  var searchBoxInputElement =  $('input[type=text]');
  
  selectEmailElement.addClass('arrow_box');

  // click on email tab for entering email value in search box

  selectEmailElement.on('click', function (e) {
   selectedInputType = 'email';

   $('.error-msg').text('Please enter a valid email address');
   $('.search-placeholder').attr('placeholder', 'Enter an Email Address');
   selectEmailElement.addClass('arrow_box');
  selectPhoneElement.removeClass('arrow_box').addClass('not-selected');
  });

  selectPhoneElement.on('click', function (e) {
    selectedInputType = 'phoneInput';
    $('.error-msg').text('Please enter a valid phone number');
    $('.search-placeholder').attr('placeholder', 'Enter Phone Number');
   selectPhoneElement.addClass('arrow_box');
    selectEmailElement.removeClass('arrow_box').addClass('not-selected');
  });

  $('#btn-search').on('click', function (e) {
    e.preventDefault();
    localStorage.clear(); //Clears storage for next request
    var inputValue = searchBoxInputElement.val().toLowerCase();

    if ( selectedInputType === 'email' && isEmailValid(inputValue)) {
        searchEmailOrNumber('email', inputValue);
    } else if ( selectedInputType === 'phoneInput' && isPhoneNumberValid(inputValue)) {
      searchEmailOrNumber('phone', inputValue);
    } else {
       searchBoxInputElement.parent().addClass('error');
    }
  });

  searchBoxInputElement.keyup(function (event) {
    inputValue = searchBoxInputElement.val().toLowerCase();
    
    if ( isEmailValid(inputValue) || isPhoneNumberValid(inputValue)) {
     searchBoxInputElement.parent().removeClass('error');
    }

    keycode = (event.keyCode ? event.keyCode : event.which);
   
    if (keycode === 13) {
      /**
       * Makes a request to ltv API to search an specific email address.
       * If there's a response, it gets stored in the local storage and redirects to results page
       */
      event.preventDefault();
      localStorage.clear(); //Clears storage for next request

      if (selectedInputType === 'email' && isEmailValid(inputValue)) {
        searchEmailOrNumber('email', inputValue);
      } else if (selectedInputType === 'phoneInput' && isPhoneNumberValid(inputValue)) {
        searchEmailOrNumber('phone', inputValue);
      } else {
       searchBoxInputElement.parentNode.classList.add('error');
      }
    }
  });
});

// check if email address is vaild or not 
function isEmailValid(email) {
 let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
 return email.match(emailRegex);
}

// check if phone number is vaild or not 
function isPhoneNumberValid(phoneNumber) {
  let phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phoneNumber.match(phoneRegex);
}

/**
       * Makes a request to ltv API to search an specific email address oe phone number.
       * If there's a response, it gets stored in the local storage and redirects to results page
       */
function searchEmailOrNumber( numberOrEmail, inputValue) {
  $('input[type=text]').parent().removeClass('error');
    const proxyurl = '';
    const url =
      `https://ltv-data-api.herokuapp.com/api/v1/records.json?${numberOrEmail}=${inputValue}`;
    fetch(proxyurl + url)
      .then((response) => response.text())
      .then(function (contents) {
        localStorage.setItem('userObject', contents);
        // add loader
      $('.loading').css({'height': '100vh','display':'flex','flex-direction':'column'}).prepend('<div><img src="assets/img/loading_spinner.gif"/></div> <div>Please wait a moment...</div>');
      $('.not-loading').remove();
      $('.loading').remove();
        window.location.href = 'result.html';
      })
      .catch((e) => console.log(e));
  }
