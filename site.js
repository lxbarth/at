(function() {
    var parseHash = function() {
        var hash = {};
        (location.hash.split('#')[1] || '')
            .split('&')
            .forEach(function(q) {
                q = q.split('=');
                if (q[0]) hash[q[0]] = decodeURI(q[1]) || true;
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

    var hash = parseHash();
    if (hash.marker) {
        var icon = L.icon({
            iconUrl: 'http://api.tiles.mapbox.com/v3/marker/pin-l-circle-stroked+3C4E59.png',
            iconRetinaUrl: 'my-icon@2x.png',
            iconAnchor: [18, 45]
        });
        var marker = hash.marker.split('/');
        L.marker(marker.slice(0, 2), {icon: icon}).addTo(map);
        map.setView(marker.slice(0, 2), marker[2]);
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
})();
