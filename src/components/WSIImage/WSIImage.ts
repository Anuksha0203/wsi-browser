/*import L from 'leaflet';
import { useEffect } from 'react';

function WSIImage() {
    useEffect(() => {
        const map = L.map('map').setView([0, 0], 0); // Start at the highest zoom-out level

        L.tileLayer('http://localhost:8080/{z}/{x}/{y}.png', {
            minZoom: 0,
            maxZoom: 2,  // Adjust based on the zoom levels you generated
            tileSize: 256,
            noWrap: true
        }).addTo(map);

        return () => map.remove();
    }, []);

    return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
}

export default WSIImage;
*/