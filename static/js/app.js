$(document).ready(function () {

    $('.registration-form').submit(function (e) {
        e.preventDefault();
        var form = $('.registration-form');
        var formData = form.serialize();

        console.log(formData);
        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            dataType: 'json',
            data: formData
        }).done(function(resp) {
            if(resp.code === 1) {
                window.location.href = resp.url;
            } else {
                $('.error-msg').show();
            }
        });

    });
});