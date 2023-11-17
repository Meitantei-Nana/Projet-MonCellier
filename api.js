var urlbase = "https://cruth.phpnet.org/epfc/caviste/public/index.php/api/";

/*
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
c*/

// Fonction d'appel des API
function api(url, methode = 'GET', donnees = null) {
    // url de base de l'API
    var urlbase = "https://cruth.phpnet.org/epfc/caviste/public/index.php/api/";
    // Requete Ajax de récuperation des données
    var request = $.ajax({
        method: methode,
        url: urlbase + url,
        data: donnees
    });
    // On retourne la requete contenant les informations
    return request;
}

// Pays
var urlPays = "wines/countries";
var reqPays = api(urlPays);
reqPays.done(function (pays) {
    //console.log(pays);
    $.each(pays, function (id, val) {
        var option = "";
        option += '<option value="' + val.country + '">';
        option += val.country;
        option += '</option>';
        $("#pays").append(option);
    });
});

// Filter


/* Vins
var vinsRecherche = $("#searchVins");
var urlVins = "wines"; //wines/search?keyword=Chateau
var reqVins = api(urlVins);
reqVins.done(function (vins) {
    //console.log("vins",vins);
    $.each(vins, function (id, val) {
        var listeVins = '<a href="#" class="list-group-item list-group-item-action">' + val.name + '</a>'
        $("#vins").append(listeVins);
    });
});*/

// Fonction d'actualisation de la liste des vins
function refreshVins(action="search") {
    // efface le contenu
    $("#vins").empty();
    // recuperation de la valeur du vins a rechercher
    var vinsRecherche = $("#searchVins").val();
    // url de l'API de recherche du vins
    var urlVins = "wines/search?keyword=" + vinsRecherche;
    // url de l'API de recherche par Pays
    var pays = $("#pays").val();
    var annee = $("#annee").val();
    var paysFiltre = "wines?key=country&val=" + pays + "&sort=year";

    var urlFinal =urlVins;
    if (action=="filtre") {
        urlFinal = paysFiltre;
    } 
    console.log("annee",annee);
    // lancement de la requete
    var reqVins = api(urlFinal);
    // recuperation et affichage des vins
    reqVins.done(function (vins) {
        console.log("vins",vins);
        $.each(vins, function (id, val) {
            if(annee == "" ){
                var listeVins = '<a href="#" onclick="afficheVin('+ val.id +')"  class="list-group-item list-group-item-action">' + val.name + '</a>'
                $("#vins").append(listeVins);
            }else{
                if (val.year === annee) {
                    var listeVins = '<a href="#" onclick="afficheVin('+ val.id +')" class="list-group-item list-group-item-action">' + val.name + '</a>'
                    $("#vins").append(listeVins);
                }
            }
        });
    });
}

// Remplissage des informations
function afficheVin(id){
    var urlV = "wines/"+id;
    var pathImg = "https://cruth.phpnet.org/epfc/caviste/public/pics/";
    var reqV = api(urlV);
    reqV.done(function(vins){
        vin = vins[0];
        console.log(vin);
        $("#name").html(vin.name);
        $("#grapes").html(vin.grapes);
        $("#id").html("#"+vin.id);
        $("#year").html(vin.year);
        $("#country").html(vin.country);
        $("#region").html(vin.region);
        $("#description").html(vin.description);
        $("#picture").attr('src',pathImg+vin.picture);
        $("#price").html(vin.price);
        $("#capacity").html(vin.capacity);
        $("#color").html(vin.color);
        $("#extra").html(vin.extra);
    });

/**
 * {
    
    "year": "2009",
   
    "country": "France",
    "region": "Burgundy",
    "description": "Breaking the mold of the classics, this offering will surprise and undoubtedly get tongues wagging with the hints of coffee and tobacco in\nperfect alignment with more traditional notes. Breaking the mold of the classics, this offering will surprise and\nundoubtedly get tongues wagging with the hints of coffee and tobacco in\nperfect alignment with more traditional notes. Sure to please the late-night crowd with the slight jolt of adrenaline it brings.",
    "picture": "morizottes.jpg",
    "price": "20.99",
    "capacity": "75.00",
    "color": "red",
    "extra": null
}
 */
}

// COnnexion



