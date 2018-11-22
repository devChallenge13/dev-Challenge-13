// Перевірка на IE10 || IE11, тому що не підтримують transform-style: preserve-3d
if (navigator.appVersion.indexOf("MSIE 10") !== -1)
{
    document.body.classList.add('IE-10');
}

var UAString = navigator.userAgent;
if (UAString.indexOf("Trident") !== -1 && UAString.indexOf("rv:11") !== -1)
{
    document.body.classList.add('IE-11');
}

document.addEventListener('DOMContentLoaded', function() {

  var shippingMethodsForm = document.querySelector('.shipping-method-form');

  document.querySelector('.submit-shipping-method').addEventListener('click', function() {
    checkValidation(shippingMethodsForm);
  });

  var shippingMethodInputs = document.querySelectorAll('input[name="shipping-method"]'),
      changeStepButtons = document.querySelectorAll('[data-change-step]'),
      steps = document.querySelectorAll('.step'),
      changeStepForms = document.querySelectorAll('[data-change-step-after-submit]');

  for (var i = 0; i < shippingMethodInputs.length; i++) {
    shippingMethodInputs[i].addEventListener('change', function() {
      shippingMethodsForm.classList.remove("has-error");
    });
  }

  for (var i = 0; i < changeStepButtons.length; i++) {
    changeStepButtons[i].addEventListener('click', function(event) {
      event.preventDefault();
      changeStep(this.dataset.changeStep)
    });
  }

  for (var i = 0; i < changeStepForms.length; i++) {
    changeStepForms[i].addEventListener('submit', function(event) {
      if (this.checkValidity()) {
        event.preventDefault();
        changeStep(this.dataset.changeStepAfterSubmit);
      }
    });
  }

  function checkValidation(form) {
    if (form.checkValidity()) {
      form.classList.remove("has-error");
      changeStep(form.dataset.changeStepAfterSubmit);
    } else {
      form.classList.add("has-error");
    }
  }

  function changeStep(newStep) {
    for (var i = 0; i < steps.length; i++) {
      steps[i].classList.remove('active');
    }

    document.querySelector('.' + newStep).classList.add('active');
  }

});
