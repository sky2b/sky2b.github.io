///<reference path='../../../../../typings/jquery.d.ts'/>
///<reference path='../../../../../typings/lib.d.ts'/>
var Download;
(function (Download) {
    $(function () {
        var confirm = $('[name=confirm]');
        function onConfirm() {
            var installer = $('#installer-link');
            var disabled = !confirm.is(':checked');
            if (disabled) {
                installer.addClass('disabled');
            } else {
                installer.removeClass('disabled');
            }
            installer.attr('href', disabled ? '#' : installer.attr('data-href'));
        }
        confirm.click(onConfirm);
        onConfirm();
    });
})(Download || (Download = {}));
