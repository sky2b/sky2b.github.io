///<reference path='../../../../../typings/jquery.d.ts'/>
///<reference path='../../../../../typings/lib.d.ts'/>
var Checkout;
(function (Checkout) {
    function pageParameters() {
        var queryString = window.location.search.substring(1);
        var params = {}, queries, temp, i, l;

        // Split into key/value pairs
        queries = queryString.split("&");

        for (i = 0, l = queries.length; i < l; i++) {
            temp = queries[i].split('=');
            params[temp[0]] = temp[1];
        }

        return params;
    }

    function createButton() {
        var parameters = pageParameters();
        var plan = parameters['plan'];
        var planNames = { gold: 'Gold Member', enterprise: 'Enterprise customer' };
        var period = $('#selectPeriod').val().split(';');
        var amount = period[1];
        var total = period[0];
        setPeriod(total);

        if (planNames[plan] && parameters['name']) {
            var business = "ANEYXX8NWLWFY";
            var custom = {
                period: parseInt(total),
                amount: parseInt(amount),
                name: parameters['name'],
                plan: plan
            };

            var data = {
                currency: { value: "USD" },
                amount: { value: amount },
                name: { value: planNames[plan] + ' - ' + period[0] + ' month(s)' },
                callback: { value: "http://fish-bones.appspot.com/paypal" },
                custom: { value: JSON.stringify(custom) }
            };

            if (parameters['test']) {
                custom['test'] = parameters['test'];
                data.env = { value: "sandbox" };
            }

            $('#' + plan + '-plan').removeClass('hidden');
            var parentNode = $("#button");
            data['custom'] = { value: JSON.stringify(custom) };
            parentNode.children().remove();
            PAYPAL.apps.ButtonFactory.create(business, data, "donate", parentNode[0]);
        }
    }

    function setPeriod(period) {
        $('#period').text(period);
    }

    $(function () {
        var confirm = $('[name=confirm]');
        confirm.click(function (e) {
            $('#button-glass').toggleClass('hidden');
        });
        var parameters = pageParameters();
        var period = parameters['period'];
        if (!period) {
            period = 1;
        } else {
            period = parseInt(period);
        }
        var period2option = { 1: 0, 3: 1, 12: 2 };
        $('#selectPeriod option:eq(' + period2option[period] + ')').prop('selected', true);
        createButton();
        $('#selectPeriod').change(createButton);
    });
})(Checkout || (Checkout = {}));
