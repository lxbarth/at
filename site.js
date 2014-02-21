(function() {
    var query = {};
    (location.search.split('?')[1] || '')
        .split('&')
        .forEach(function(q) {
            q = q.split('=');
            if (q[0]) query[q[0]] = q[1] || true;
        });

    var map = L.mapbox.map('map', 'lxbarth.map-lxoorpwz');

    if (query.marker) {
        var marker = query.marker.split('/');
        L.marker(marker.slice(0, 2)).addTo(map);
        map.setView(marker.slice(0, 2), marker[2]);
    }
    if (query.text) {
        var text = document.getElementById('text');
        text.innerHTML = decodeURI(query.text);
    }
})();
