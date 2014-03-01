(function() {
    var parseHash = function() {
        var hash = {};
        (location.hash.split('#')[1] || '')
            .split('&')
            .forEach(function(q) {
                q = q.split('=');
                if (q[0] && q[1]) hash[q[0]] = decodeURI(q[1]);
            });
        return hash;
    };
    var setHash = function(params) {
        var hash = parseHash(location.search);
        for (var k in params) {
            hash[k] = params[k];
        }
        var newHash = [];
        for (var k in hash) {
            newHash.push(k + '=' + encodeURI(hash[k]));
        }
        location.hash = newHash.join('&');
    };

    var map = L.mapbox.map('map', 'lxbarth.map-lxoorpwz');

    var marker = null;
    var placeMarker = function(pos) {
        marker && map.removeLayer(marker);
        var icon = L.icon({
            iconUrl: 'http://api.tiles.mapbox.com/v3/marker/pin-l-circle-stroked+3C4E59.png',
            iconRetinaUrl: 'my-icon@2x.png',
            iconAnchor: [18, 45]
        });
        marker = L.marker(pos, {icon: icon}).addTo(map);
    };

    var hash = parseHash();
    if (hash.marker) {
        var m = hash.marker.split('/');
        placeMarker(m.slice(0, 2));
        map.setView(m.slice(0, 2), m[2]);
    }
    var startMessage = "Type your message here";
    var text = document.getElementById('text');
    if (hash.text) {
        text.innerHTML = hash.text;
        text.onclick = function(){
            marker && map.setView(marker.slice(0, 2), marker[2]);
        };
    } else {
        text.setAttribute('contentEditable', true);
        text.innerHTML = startMessage;
        text.onclick = function() {
            if (text.innerHTML == startMessage) {
                text.innerHTML = '';
            }
        };
        text.onkeyup = function() {
            setHash({text: text.innerHTML});
        };
    }
    var mapDiv = document.getElementById('map');
    var last = {};
    mapDiv.onmousedown = function(e) {
        last.t = Date.now();
        last.x = e.x;
        last.y = e.y;
    };
    mapDiv.onmouseup = function(e) {
        var d = Math.sqrt((e.x - last.x) * (e.x - last.x) + (e.y - last.y) * (e.y - last.y));
        if ((Date.now() - last.t) > 300 && d < 10) {
            var pos = map.containerPointToLatLng(L.point(e.x - 20, e.y - 20));
            placeMarker(pos);
            map.panTo(pos);
            setHash({marker: pos.lat + '/' + pos.lng + '/' + map.getZoom()});
        }
    };
})();
