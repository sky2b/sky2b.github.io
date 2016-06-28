(function(){
var key = Cookies.get('key');
var ERROR_UNKNOWN = "There was error! Try again later!"

// if(!key){
//     window.location.href = "login.html"
// }

var messageBox = $("#message").remove().css("display", "block");

function showMessage(message){
    messageBox.prependTo($("body")).find("p").text(message);
}

$("#showKey").on('shown.bs.modal', function () {
    $("#key-value").val(key);
});

$("#logout").hammer().bind("tap", function(e){
    Cookies.remove('key');
    window.location.href = "login.html"
});

var requestState, refreshButton = $("#refresh");

function refreshRequestFinished(){
    requestState = null;
    refreshButton.find(".fa").addClass("fa-refresh").removeClass("fa-spinner fa-spin");
}

refreshButton.hammer().bind("tap", function(e){
    if (requestState == "wait"){
        refreshRequestFinished();
        return;
    }

    requestState = "wait";
    refreshButton.find(".fa").removeClass("fa-refresh").addClass("fa-spinner fa-spin");


    var message = {
        type: "info",
        token: key,
    };

    $.ajax({
        method:"POST",
        url: AddGears.usersServer + "/user",
        data:{
            data:JSON.stringify(message)
        },
    })
    .done(function(){
        refreshRequestFinished();
    })
    .fail(function(){
        showMessage(ERROR_UNKNOWN);
    })
    .then(function(data){

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

        console.log(result);

        if (result.session){
            Cookies.set('key', result.session, { expires:1 });
            delete result.session;
            updateStatus(result);
        } else if (result.message){
            showMessage("Message: " + result.message);
        }
    })
    ;
});

function updateStatus(session){
    var html = "<strong>Plan:</strong> " + session.type;
    $("#status p").html(html);
}

})();
