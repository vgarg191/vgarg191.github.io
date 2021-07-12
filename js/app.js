
$(document).ready(function () {

  var selectedInputType = 'email';
  $('.select-email').addClass('arrow_box');

  $('.select-email').on('click', function (e) {
   selectedInputType = 'email';
   $('.search-placeholder').attr('placeholder', 'Enter an Email Address');
   $('.select-email').addClass('arrow_box');
   $('.select-phone').removeClass('arrow_box').addClass('not-selected');
   /* $('.select-phone').addClass('not-selected'); */
  });

  $('.select-phone').on('click', function (e) {
    selectedInputType = 'phoneInput';
    $('.search-placeholder').attr('placeholder', 'Enter Phone Number');
    $('.select-phone').addClass('arrow_box');
    $('.select-email').removeClass('arrow_box').addClass('not-selected');
  });

  $('#btn-search').on('click', function (e) {
    e.preventDefault();
    localStorage.clear(); //Clears storage for next request
    var inputValue = $('input[type="text"]').val().toLowerCase();

    if ( selectedInputType === 'email' && isEmailValid(inputValue)) {
        searchEmailOrNumber('email', inputValue);
    } else if ( selectedInputType === 'phoneInput' && isPhoneNumberValid(inputValue)) {
      searchEmailOrNumber('phone', inputValue);
    } else {
        $('input[type=text]').parent().addClass('error');
    }
  });

  $('input[type="text"]').keyup(function (event) {
    inputValue = $('input[type=text]').val().toLowerCase();
    
    if ( isEmailValid(inputValue) || isPhoneNumberValid(inputValue)) {
      $('input[type=text]').parent().removeClass('error');
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
        $('input[type=text]').parentNode.classList.add('error');
      }
    }
  });
});

function isEmailValid(email) {
 let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
 return email.match(emailRegex);
}

function isPhoneNumberValid(phoneNumber) {
  let phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phoneNumber.match(phoneRegex);
}

function searchEmailOrNumber( numberOrEmail, inputValue) {
    $('input[type=text]').removeClass('error');
    const proxyurl = '';
    const url =
      `https://ltv-data-api.herokuapp.com/api/v1/records.json?${numberOrEmail}=${inputValue}`;
    fetch(proxyurl + url)
      .then((response) => response.text())
      .then(function (contents) {
        localStorage.setItem('userObject', contents);
      $('.loading').css({'height': '100vh','display':'flex','flex-direction':'column'}).prepend('<div><img src="assets/img/loading_spinner.gif"/></div> <div>Please wait a moment...</div>');
      $('.not-loading').remove();
      $('.loading').remove();
        window.location.href = 'result.html';
      })
      .catch((e) => console.log(e));
  }