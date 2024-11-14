
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission
    Array.from(forms).forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    })
})()


document.getElementById('navbar-toggler').addEventListener('click', function() {
    var navbar = document.getElementById('navbar');
    navbar.classList.toggle('bg-active'); // Add/remove class when menu toggled
});
