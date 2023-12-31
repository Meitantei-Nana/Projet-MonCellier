var urlbase = "https://cruth.phpnet.org/epfc/caviste/public/index.php/api/";

const btSearch = document.getElementById('btSearch');

btSearch.addEventListener('click', function (e) {
    refreshVins();
});

const btfiltre = document.getElementById('btFiltre');

btSearch.addEventListener('click', function (e) {
    refreshVins('filtre');
});


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
*/

/**
 * 
 * @param {*} url partie d' url a ajouter a url de base
 * @param {*} methode méthode http a utiliser
 * @param {*} donnees données a envoyer avec la requete
 * @returns retourne l' objet request qui contient la réponse de la requete 
 */
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


var grapeNames = new Set()
/**
 * récupere les noms de raisains dans un tableau sans doublon
 */

function recupererRaisainsApi() {
    reqgrapes = api("wines");

    reqgrapes.done(function (vins) {
        vins.forEach(function (vin) {
            if (vin.grapes) {

                var raisins = vin.grapes.split(',').map(function (raisin) {
                    return raisin.trim();
                });
                raisins.forEach(function (raisin) {
                    grapeNames.add(raisin);
                })
            }

        });
        console.log('grapes : ' + Array.from(grapeNames));
        ajouterraisainAuselect(grapeNames);
    })
}
recupererRaisainsApi();


/**
 * utilisation de jquery
 * @param {*} raisins liste des raisain
 */
var selectedCepage = '';
function ajouterraisainAuselect(raisins) {
    var $selectCephage = $('#cephage');

    $selectCephage.empty();

    $selectCephage.append($('<option>', { value: '', text: 'All grapes' }));

    raisins.forEach(function (raisin) {
        $selectCephage.append($('<option>', { value: raisin, text: raisin }));

        console.log('selected'.$selectCephage);
    });
    $selectCephage.change(function () {
        selectedCepage = $(this).val();
    });
}


ajouterraisainAuselect(grapeNames);

// Pays
var urlPays = "wines/countries";
var reqPays = api(urlPays);
/**
 *  ajout des pays dans la liste défilante du formulaire
 */
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
var fullUrls = "wines"; //wines/search?keyword=Chateau
var reqVins = api(fullUrls);
reqVins.done(function (vins) {
    //console.log("vins",vins);
    $.each(vins, function (id, val) {
        var listeVins = '<a href="#" class="list-group-item list-group-item-action">' + val.name + '</a>'
        $("#vins").append(listeVins);
    });
});
*/
// Fonction d'actualisation de la liste des vins

/**
 * gere l' affichage et la recherche de vins basé sur critere de filtrage ou sans.
 * @param {*} action bouton déclencheur
 */

function refreshVins(action = "search") {
    // efface le contenu
    $("#vins").empty();
    // recuperation de la valeur du vins a rechercher
    var vinsRecherche = $("#searchVins").val();
    // url de l'API de recherche du vins
    var fullUrls = "wines/search?keyword=" + vinsRecherche;
    // url de l'API de recherche par Pays
    var pays = $("#pays").val();
    var annee = $("#annee").val();
    var cepage = $('#cephage').val();

    console.log(cepage);
    var paysFiltre = "wines?key=country&val=" + pays + "&sort=year";

    var urlFinal = fullUrls;
    if (action == "filtre") {
        urlFinal = paysFiltre;
    }
    console.log("annee", annee);
    // lancement de la requete
    var reqVins = api(urlFinal);
    // recuperation et affichage des vins
    reqVins.done(function (vins) {
        // Filtrez par année et pays

        /**
         * crée un nouveau tab filtré avec les nouveaux criteres
         */
        var vinsFiltres = vins.filter(function (vin) {
            var filtreAnnee = annee === "" || vin.year === annee;
            var filtrePays = pays === "All Countries" || vin.country === pays;
            return filtreAnnee && filtrePays;
        });

        // Tri par cépage
        if (cepage !== "All grapes") {
            vinsFiltres.sort(function (a, b) {
                var grapesA = a.grapes || "";
                var grapesB = b.grapes || "";
                return grapesA.localeCompare(grapesB);
            });
        }

        console.log("Vins filtrés et triés : ", vinsFiltres); // Pour le débogage

        // Afficher les vins filtré 
        vinsFiltres.forEach(function (val) {
            var listeVins = '<a href="#" onclick="afficheVin(' + val.id + ')" class="list-group-item list-group-item-action">' + val.name + '</a>';
            $("#vins").append(listeVins);
        });
    });
}

// Remplissage des informations


/**
 * complete les détails du vin
 * @param {*} id du vin
 */
function afficheVin(id) {
    var urlV = "wines/" + id;
    var pathImg = "https://cruth.phpnet.org/epfc/caviste/public/pics/";
    var reqV = api(urlV);

    reqV.done(function (vins) {
        vin = vins[0];
        console.log(vin);
        $("#name").html(vin.name);
        $("#grapes").html(vin.grapes);
        $("#id").html("#" + vin.id);
        $("#year").html(vin.year);
        $("#country").html(vin.country);
        $("#region").html(vin.region);
        $("#description").html(vin.description);
        $("#picture").attr('src', pathImg + vin.picture);
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



/**
 * charge le contenu de la page en fct de l id fourni
 * @param {*} pageID id du contenu (home - a propos - login)
 */

function chargercontenu(pageID) {
    console.log("Chargement du contenu pour :", pageID);
    const contentSections = $(".page-content");
    contentSections.hide();

    const selectedContent = $("#" + pageID);
    selectedContent.show();
}

$(document).ready(function () {
    $("[data-target]").click(function (event) {
        event.preventDefault();
        var pageID = $(this).data('target');
        chargercontenu(pageID);
    });
});











function authentifier(login, password) {

    const reqconnexion = "https://cruth.phpnet.org/epfc/caviste/public/index.php/api/users/authenticate";

    const credentials = btoa(login + ':' + password);

    fetch(reqconnexion, {
        method: "GET",
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': 'Basic ' + credentials
        }, verbose: true
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Échec de l\'authentification avec le statut ' + response.statusText);

            }
            return response.json();




        })
        .then(data => {
            console.log(data);
            if (data.success) {
                sessionStorage.setItem('userId', data.id);
                sessionStorage.setItem('credentials', credentials);

                $('#loginStatus').html(`
             <p>Vous êtes connecté. Bienvenue !</p>
          <a href="#home" onclick="chargercontenu('home')">Retour à l'accueil</a>
        `);

            }



        }).catch(error => {
            console.log(error);

            $('#loginStatus').text(error.message);


        })



}


/**
 * 
 * @returns {boolean} si l' utilisateur est authentifié 
 */
function estAuthentifie() {
    const userId = sessionStorage.getItem('userId');
    if (userId) {
        console.log('Toujours connecté');
        return true;
    } else {
        console.log('Pas de session active');

        return false;
    }
}



const loginForm = document.getElementById("loginForm");


loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const loginA = $('#loginlabel').val();
    const passwordB = $('#passwordlabel').val();
    // Lancer l'action
    authentifier(loginA, passwordB);
    console.log(estAuthentifie);
});




function ajoutercommentaire(wineId, commentaire) {


    var fullUrl = 'https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + wineId + '/comments'
    var storedCredentials = sessionStorage.getItem('credentials');
    if (commentaire) {

        const options = {
            method: 'post',
            body: JSON.stringify({ 'content': commentaire }),
            headers: {
                'content-type': 'application/json; charset=utf-8',
                'Authorization': 'Basic ' + storedCredentials
            }
        };

        fetch(fullUrl, options)
            .then((response) => {
                if (response.ok) {
                    console.log(response);
                    return response.json();
                } else {
                    throw new Error('erreur d envoi de commentaire');
                }

            }).then(data => {

                console.log('commentaire ajouté'.data);

            })

    }

}

function modifiercommentaire(wineId, commentid) {


}
/**
 * gestion des comportements selon le click 
 */

$(document).ready(function () {
    $('.btn-action').click(function () {

        var wineId = $(this).data('wineId');
        var commentaire = $('#comment').val().trim();

        if (estAuthentifie()) {
            var action = $(this).data('action');
            switch (action) {
                case 'ajouter':
                    console.log("Ajouter");
                    ajoutercommentaire(wineId, commentaire);

                    break;
                case 'modifier':
                    modifiercommentaire();
                    console.log("Modifier");

                    break;
                case 'supprimer':
                    supprimercommentaire();
                    console.log("Supprimer");
                    // Logique pour Supprimer

                    break;
                default:
                    console.log("Action non reconnue");
            }
        } else {

            chargercontenu('login');
        }



    });
})



/**
 * deconnecte l utilisateur 
 */
function logout() {
    sessionStorage.removeItem('userId');

}


/*
window.addEventListener('beforeunload', function (e) {

    logout();


    e.returnValue = 'deconnecté';
});*/

// COnnexion
