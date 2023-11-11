var urlbase = "https://cruth.phpnet.org/epfc/caviste/public/index.php/api/";

$.ajax({
    method: "GET",
    url: urlbase + "wines/countries",
    data: {}
}).done(function (pays) {
    console.log(pays);
    $.each(pays, function (id, val) {
        var option = "";
        option += '<option value="' + val.country + '">';
        option += val.country;
        option += '</option>';
        $("#pays").append(option);
    });
});