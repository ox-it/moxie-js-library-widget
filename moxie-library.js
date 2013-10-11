$(function() {
    $.each($("div[data-aleph-id]"), function(_, widgetEl) {
        widgetEl = $(widgetEl);
        var alephID = widgetEl.data('aleph-id');
        var moxieLibraryEndpoint = "http://api.m.ox.ac.uk/library/item:";
        var mapOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 13,
            scrollControl: false,
            streetViewControl: false,
            mapTypeControl: false,
        };
        var mapBounds = new google.maps.LatLngBounds();
        var markers = [];
        $.ajax(moxieLibraryEndpoint+alephID+'/', {
            dataType: "json",
            success: function(data) {
                var holdings = "";
                var mapEl = document.createElement('div');
                mapEl.style.height = "150px";
                mapEl.style.width = "25%";
                widgetEl.after(mapEl);
                var map = new google.maps.Map(mapEl, mapOptions);
                var libraries = [];
                $.each(data._embedded, function(holdingID, poi) {
                    libraries.push(poi.name);
                    var latlng = new google.maps.LatLng(poi.lat, poi.lon);
                    mapBounds.extend(latlng);
                    markers.push(new google.maps.Marker({
                        position: latlng,
                        title: poi.name,
                        map: map,
                    }));
                });
                widgetEl.html('<ul style="width: 70%; float: left;">'+
                    '<li>'+data.author+'</li>'+
                    '<li>'+data.title+'</li>'+
                    '<li>Copies available from: '+libraries.join(', ')+'</li>'+
                    '<li><a href="http://solo.bodleian.ox.ac.uk/primo_library/libweb/action/dlDisplay.do?docId=oxfaleph'+data.id+'">Reserve in SOLO</a></li>'+
                '</ul>');
                map.setCenter(mapBounds.getCenter());
            }
        });
    });
});
