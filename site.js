(function() {
    var app = (function() {
        var app = {};
        app.marker = null;
        app.map = L.mapbox.map('map', 'lxbarth.map-lxoorpwz');

        app.parseHash = function() {
            var hash = {};
            (location.hash.split('#')[1] || '')
                .split('&')
                .forEach(function(q) {
                    q = q.split('=');
                    if (q[0] && q[1]) hash[q[0]] = decodeURI(q[1]);
                });
            return hash;
        };
        app.setHash = function(params) {
            var hash = app.parseHash(location.search);
            for (var k in params) {
                hash[k] = params[k];
            }
            var newHash = [];
            for (var k in hash) {
                newHash.push(k + '=' + encodeURI(hash[k]));
            }
            location.hash = newHash.join('&');
        };
        app.placeMarker = function(pos) {
            app.marker && app.map.removeLayer(app.marker);
            var icon = L.icon({
                iconUrl: 'http://api.tiles.mapbox.com/v3/marker/pin-l-circle-stroked+3C4E59.png',
                iconRetinaUrl: 'my-icon@2x.png',
                iconAnchor: [18, 45]
            });
            app.marker = L.marker(pos, {icon: icon}).addTo(app.map);
        };
        app.view = function() {
            var hash = app.parseHash();
            var m = hash.marker.split('/');
            app.placeMarker(m.slice(0, 2));
            app.map.setView(m.slice(0, 2), m[2]);
            document.getElementById('text').setAttribute('contentEditable', false);
            document.getElementById('text').innerHTML = hash.text;
            document.getElementById('save').style.display = 'none';
            document.getElementById('new').style.display = 'block';
            document.getElementById('new').onclick = function() {
                app.edit();
            };
        };
        app.edit = function() {
            location.hash = '';
            var textDiv = document.getElementById('text');
            var startMsg = textDiv.innerHTML = 'Type your message here';
            textDiv.onclick = function() {
                if (textDiv.innerHTML == startMsg) {
                    textDiv.innerHTML = '';
                }
            };
            document.getElementById('text').setAttribute('contentEditable', true);
            var mapDiv = app.map.getContainer();
            var last = {};
            mapDiv.onmousedown = function(e) {
                last.t = Date.now();
                last.x = e.x;
                last.y = e.y;
            };
            mapDiv.onmouseup = function(e) {
                var d = Math.sqrt((e.x - last.x) * (e.x - last.x) + (e.y - last.y) * (e.y - last.y));
                if ((Date.now() - last.t) > 300 && d < 10) {
                    var pos = app.map.containerPointToLatLng(L.point(e.x - 20, e.y - 20));
                    app.placeMarker(pos);
                    app.map.panTo(pos);
                }
            };
            document.getElementById('new').style.display = 'none';
            document.getElementById('save').style.display = 'block';
            document.getElementById('save').onclick = function() {
                var pos = app.marker.getLatLng();
                app.setHash({marker:
                    pos.lat + '/' +
                    pos.lng + '/' +
                    app.map.getZoom()});
                app.setHash({text: textDiv.innerHTML});
                app.view();
            };
        };
        return app;
    })();

    var hash = app.parseHash();
    if (hash.marker && hash.text) {
        app.view();
    } else {
        app.edit();
    }
})();
