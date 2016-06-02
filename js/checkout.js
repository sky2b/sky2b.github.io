(function () {
    function pageParameters() {
        var queryString = window.location.search.substring(1);
        var params = {}, queries, temp, i, l;

        queries = queryString.split("&");

        for (i = 0, l = queries.length; i < l; i++) {
            temp = queries[i].split('=');
            params[temp[0]] = temp[1];
        }

        return params;
    }

    var parameters = pageParameters();
    var plan = parameters['plan'];
    var root, form;

    function selectedOptions(root){
        var description = root.find("[data-service]").text()
        var options = {
            callback: root.is("[data-callback]")
        };

        var amount = root.find("[name=amount]")
        if (amount.is("input")) {
            options.amount = parseInt(amount.val())
            description += " (" + options.amount + "$)"
        }

        var name = root.find("[name=email]")
        if (name.is("input")){
            options.name= name.val();
        }

        var period = root.find("[name=period]")
        if (period.is("select")){
            var periodAmount = period.val().split(";");
            options.period = periodAmount[0];
            options.amount = periodAmount[1];
            var units = root.filter("[data-units]").attr("data-units") || "month(s)";
            description += " (" + options.amount + "$)"
            description += ' for ' + periodAmount[0] + ' ' + units;
        }

        options.description = description;
        return options;
    }

    function createButton() {
        var options = selectedOptions(root)

        var business = "24BWA6WRUMATU";
        var custom = {
            period: options.period,
            amount: options.amount,
            name: options.name,
            plan: plan
        };

        if (parameters['test']) {
            custom['test'] = true;
        }

        var data = {
            currency: { value: "USD" },
            amount: { value: options.amount },
            name: { value: options.description },
            custom: { value: JSON.stringify(custom) }
        };

        if (options.callback) {
            data.callback = { value: "http://fish-bones.appspot.com/paypal" }
        }

        if (parameters['test']) {
            data.env = { value: "sandbox" };
        }

        var parentNode = $("#button");

        parentNode.children().remove();

        console.log(data)

        PAYPAL.apps.ButtonFactory.create(business, data, "donate", parentNode[0]);
        $('#order-details').text(options.description);
    }

    function allowNext(){
        var glass = $('#button-glass');
        if ($('[name=confirm]').get(0).checked){
            glass.addClass('hidden');
        }else{
            glass.removeClass('hidden');
        }
    }

    function showCheckout(){
        if (!form.valid()){
            return ;
        }
        createButton();
        $("[data-selection]").addClass("hidden").removeClass("animated slideInLeft")
        $("[data-checkout]").removeClass("hidden").addClass("animated slideInLeft")
    }

    function amend(){
        $("[data-selection]").removeClass("hidden").addClass("animated slideInLeft")
        $("[data-checkout]").addClass("hidden").removeClass("animated slideInLeft")
    }

    var BootstrapFormValidation = {
        highlight: function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    };

    $(function () {
        var plans = $('[data-plan]')
        root = plans.filter('[data-plan=' + plan + ']')

        root.removeClass('hidden');
        form = root.closest('form');
        plans.filter(".hidden").remove();

        form.validate($.extend({
            rules: {
                amount: {
                    required: true,
                    min: 5
                },
                email:{
                    required: true,
                    email: true
                }
            }
        }, BootstrapFormValidation));

        $('[name=confirm]').click(allowNext);
        $('[data-next]').click(showCheckout);
        $("#amend").click(amend)
    })
})();
