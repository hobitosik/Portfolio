if ($.cookie("TowerLiked") == 1) {
    $("#invite").hide(0);

} else if ($.cookie("TowerLiked") == 2){
    $("#invite").delay(3000).hide(0).delay(45000).show(0)
        .animate({
        opacity: 1
    }, {
        duration: 2000
    });
    $('.like').hide(0).delay(1000).slideDown(1000);

    $("span#Forever").click(function () {
        $('#invite').animate({
            opacity: 0
        }, {
            duration: 1000
        }).hide(0);
        $.cookie('TowerLiked', '1', {
            path: '/'
        });
    });
    $("span#Now").click(function () {
        $('#invite').animate({
            opacity: 0
        }, {
            duration: 1000
        }).hide(0);
        $.cookie('TowerLiked', '1', {
        	expires: 1,
            path: '/'
        });
    });
}
else {
    $("#invite").delay(3000).hide(0).delay(30000).show(0)
        .animate({
        opacity: 1
    }, {
        duration: 2000
    });
    $('.like').hide(0).delay(1000).slideDown(1000);

    $("span#Forever").click(function () {
        $('#invite').animate({
            opacity: 0
        }, {
            duration: 1000
        }).hide(0);
        $.cookie('TowerLiked', '1', {
            path: '/'
        });
    });
    $("span#Now").click(function () {
        $('#invite').animate({
            opacity: 0
        }, {
            duration: 1000
        }).hide(0);
        $.cookie('TowerLiked', '2', {
        	expires: 1,
            path: '/'
        });
    });
}