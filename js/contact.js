///<reference path='../../../../../typings/jquery.d.ts'/>
///<reference path='../../../../../typings/lib.d.ts'/>

var Contact;
(function (Contact) {
    function showMessage(type) {
        var alerts = $('.alert');
        var one = alerts.filter('#message-' + type);
        if (one.is('.hide')) {
            alerts.not('.hide').removeClass('in').addClass('hide');
            one.removeClass('hide');
        }
        one.addClass('in');
    }

    function hideMessages() {
        $('.alert').not('.hide').removeClass('in');
    }

    $(function () {
        $('.alert .close').click(function () {
            $(this).closest('.alert').removeClass('in');
        });
        $("#contact-form").validationEngine('attach', { promptPosition: "centerRight" });
        $('a.has-spinner').click(function () {
            var button = $(this);
            if (button.is('.active')) {
                return;
            }

            if (!$("#contact-form").validationEngine('validate')) {
                return;
            }

            hideMessages();
            var url = '/contact';
            if (window.location.hostname == 'localhost') {
                url = 'http://localhost:8080' + url;
            } else {
                url = 'http://fish-bones.appspot.com' + url;
            }
            button.addClass('active');
            var data = {};
            $('#contact-form [name]').each(function () {
                var el = $(this);
                data[el.attr('name')] = el.val();
            });
            $.when($.ajax({
                url: url,
                dataType: "jsonp",
                data: data,
                timeout: 10000,
                crossDomain: true
            })).done(function (v) {
                showMessage(v.ok ? 'success' : 'error');
            }).fail(function () {
                showMessage('error');
            }).always(function () {
                button.removeClass('active');
            });
        });
    });
})(Contact || (Contact = {}));
