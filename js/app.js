(function () {

  var selectedInputType = 'email';
  var selectEmailElement = $('.select-email');
  var selectPhoneElement = $('.select-phone');
  var searchBoxInputElement = $('input[type=text]');
  var errorMessageElement = $('.error-msg');
  var searchPlaceholderElement = $('.search-placeholder');
  selectEmailElement.addClass('arrow_box');

  // click on email tab for entering email value in search box

  selectEmailElement.on('click', function (e) {
    selectedInputType = 'email';

    errorMessageElement.text('Please enter a valid email address');
    searchPlaceholderElement.attr('placeholder', 'Enter an Email Address');
    selectEmailElement.addClass('arrow_box');
    selectPhoneElement.removeClass('arrow_box').addClass('not-selected');
  });

  selectPhoneElement.on('click', function (e) {
    selectedInputType = 'phoneInput';
    errorMessageElement.text('Please enter a valid phone number');
    searchPlaceholderElement.attr('placeholder', 'Enter Phone Number');
    selectPhoneElement.addClass('arrow_box');
    selectEmailElement.removeClass('arrow_box').addClass('not-selected');
  });

  $('#btn-search').on('click', function (e) {
    e.preventDefault();
    localStorage.clear(); //Clears storage for next request
    var inputValue = searchBoxInputElement.val().toLowerCase();

    if (selectedInputType === 'email' && isEmailValid(inputValue)) {
      startSeach('email', inputValue);
    } else if (selectedInputType === 'phoneInput' && isPhoneNumberValid(inputValue)) {
      startSeach('phone', inputValue);
    } else {
      searchBoxInputElement.parent().addClass('error');
    }
  });

  searchBoxInputElement.keyup(function (event) {
    onKeyPress(event, searchBoxInputElement);
  });

  /** run on every key press to remove error message if email or phone number is valid 
   * on enter key press and if input value is valid, make a API call
   */
  function onKeyPress(event, searchBoxInputElement) {
    inputValue = searchBoxInputElement.val().toLowerCase();

    if (isEmailValid(inputValue) || isPhoneNumberValid(inputValue)) {
      searchBoxInputElement.parent().removeClass('error');
    }

    keycode = (event.keyCode ? event.keyCode : event.which);

    if (keycode === 13) {

      event.preventDefault();
      localStorage.clear(); //Clears storage for next request

      if (selectedInputType === 'email' && isEmailValid(inputValue)) {
        startSeach('email', inputValue);
      } else if (selectedInputType === 'phoneInput' && isPhoneNumberValid(inputValue)) {
        startSeach('phone', inputValue);
      } else {
        searchBoxInputElement.addClass('error');
      }
    }
  }

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
  * Makes a request to ltv API to search an specific email address or phone number.
  * If there's a response, it gets stored in the local storage and redirects to results page
  */
  function startSeach(typeOfSeach, inputValue) {
    let loadingElement = $('.loading');

    $('input[type=text]').parent().removeClass('error');
    loadingElement.prepend('<div><img src="assets/img/loading_spinner.gif"/></div> <div>Please wait a moment...</div>');
    loadingElement.addClass('loading-start');

    const url =
      `https://ltv-data-api.herokuapp.com/api/v1/records.json?${typeOfSeach}=${inputValue}`;
    fetch(url)
      .then((response) => response.text())
      .then(function (contents) {
        localStorage.setItem('userObject', contents);
        $('.not-loading').remove();
        loadingElement.remove();
        window.location.href = 'result.html';
      })
      .catch((e) => console.log(e));
  }
})();
