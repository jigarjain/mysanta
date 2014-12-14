$(document).ready(function () {

    $(document).foundation();

    (function($) {
            $.fn.countTo = function(options) {
                // merge the default plugin settings with the custom options
                options = $.extend({}, $.fn.countTo.defaults, options || {});

                // how many times to update the value, and how much to increment the value on each update
                var loops = Math.ceil(options.speed / options.refreshInterval),
                        increment = (options.to - options.from) / loops;

                return $(this).each(function() {
                    var _this = this,
                            loopCount = 0,
                            value = options.from,
                            interval = setInterval(updateTimer, options.refreshInterval);

                    function updateTimer() {
                        value += increment;
                        loopCount++;
                        $(_this).html(value.toFixed(options.decimals));

                        if (typeof (options.onUpdate) == 'function') {
                            options.onUpdate.call(_this, value);
                        }

                        if (loopCount >= loops) {
                            clearInterval(interval);
                            value = options.to;

                            if (typeof (options.onComplete) == 'function') {
                                options.onComplete.call(_this, value);
                            }
                        }
                    }
                });
            };

            $.fn.countTo.defaults = {
                from: 0, // the number the element should start at
                to: 100, // the number the element should end at
                speed: 1000, // how long it should take to count between the target numbers
                refreshInterval: 100, // how often the element should be updated
                decimals: 0, // the number of decimal places to show
                onUpdate: null, // callback method for every time the element is updated,
                onComplete: null  // callback method for when the element finishes updating
            };
        })($);

    $('.banner .count').countTo({
        from: 0,
        to: $('.banner .count').data('count'),
        speed: 2000,
        refreshInterval: 50
    });

    if ($('.social-share').length) {
        var sTimeout = $('.social-share').data('timeout');

        // Social media
        setTimeout(function(){
            // Fb
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }

                js = d.createElement(s);
                js.id = id;
                js.src = '//connect.facebook.net/en_IN/all.js';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            window.fbAsyncInit = function() {
                FB.init({
                    appId      : '754431431295099',                        // App ID from the app dashboard
                    status     : true,                             // Check Facebook Login status
                    xfbml      : true                              // Look for social plugins on the page
                });
            };

            //Twitter
            (function(d, s, id) {
                var js, fjs= d.getElementsByTagName(s)[0];
                if(!d.getElementById(id)){
                    js= d.createElement(s);
                    js.id= id;
                    js.src= 'https://platform.twitter.com/widgets.js';
                    fjs.parentNode.insertBefore(js,fjs);
                }
            }(document, 'script' , 'twitter-wjs' ));

            //Google Plus
            (function() {
                var po = document.createElement('script');
                po.type = 'text/javascript';
                po.async = true;
                po.src = 'https://apis.google.com/js/plusone.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(po, s);
            })();
        }, sTimeout);
    }

    // Adding pairing
    $('.add-pairing').submit(function (e) {
        e.preventDefault();

        $('.error-msg').html('Submitting..');
        var form = $('.add-pairing');
        var formData = form.serialize();

        $.ajax({
            url: form.attr('action'),
            method: 'POST',
            dataType: 'json',
            data: formData
        }).done(function(resp) {
            if(resp.code === 1) {
                $('.error-msg').html('Added successfully');
                form.find('input').val('');
            } else {
                $('.error-msg').html(resp.error);
            }
        });
    });

});