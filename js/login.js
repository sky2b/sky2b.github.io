(function(){
    var loginForm = $('form');

    var validationOptions = {
        rules: {
            pass: {
                required: true,
                minlength: 6
            },
            email:{
                required: true,
                email: true
            }
        }
    };
    loginForm.validate(validationOptions);

    var requestState;
    var messageBox = $("#message").remove().css("display", "block");

    function showMessage(message){
        messageBox.prependTo($("body")).find("p").text(message);
    }

    var ERROR_UNKNOWN = "There was some error. Try again later!";
    var actionButton = $("#action");
    var email = Cookies.get("email");
    if (email){
        $("[name=email]", loginForm).val(email);
    }

    actionButton.hammer().bind("tap", function(e){
        if(loginForm.valid()){
            if (requestState == "wait"){
                requestState = "canceled";
                actionButton.val(actionNames[action]);
            }else{
                requestState = "wait";
                actionButton.val('wait..');

                messageBox.remove();
                var email = $("[name=email]", loginForm).val();
                Cookies.set("email", email);

                var message = {
                    type: action,
                    user: email,
                    password: $("[name=pass]", loginForm).val(),
                }

                $.ajax({
                    method:"POST",
                    url: AddGears.usersServer + "/auth",
                    data:{
                        data:JSON.stringify(message)
                    },
                })
                .done(function(){
                    requestState = null;
                })
                .fail(function(){
                    showMessage(ERROR_UNKNOWN);
                })
                .then(function(data){
                    actionButton.val(actionNames[action])

                    if (!data){
                        showMessage(ERROR_UNKNOWN);
                        return;
                    }

                    var result;
                    try{
                        result = JSON.parse(data);
                    }catch(e){
                        showMessage(ERROR_UNKNOWN);
                        return;
                    }
                    if (result.error){
                        showMessage("Error: " + result.error);
                        return;
                    }

                    if (result.session){
                        Cookies.set('key', result.session, { expires:1 });
                        window.location.href = "index.html"
                    }else if (result.message){
                        showMessage("Message: " + result.message);
                    }
                })
                ;
            }

        }
    });

    var action = "login", prevAction;

    var headers = {
        "login": "Login to Your Account",
        "register": "Register New User",
        "remind" : "Send Me Reminder"
    };

    var actionNames = {
        "login": "Login",
        "register": "Register",
        "remind" : "Remind"
    };

    function setup(next){
        prevAction = action;
        action = next;
        $("#action").val(actionNames[action]);
        $("#header").text(headers[action]);

        $("#" + action).css("display","none");
        $("#" + prevAction).css("display","inline-block");
        if (action == "remind"){
            $("[name=pass]").css("display","none").rules("remove");
            loginForm.validate().resetForm();
        }else if (prevAction == "remind"){
            $("[name=pass]").css("display","inline-block").rules("add", validationOptions.rules.pass);
            loginForm.validate().resetForm();
        }
    }

    ["register", "remind", "login"].forEach(function(name){
        $("#" + name).hammer().bind("tap", function(){
            setup(name);
        });
    });

})();
