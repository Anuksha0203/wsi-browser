'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";
import styles from './MainImage.module.css';

    // Extend the TileLayerOptions interface to include edgeBufferTiles
    declare module 'leaflet' {
        interface TileLayerOptions {
            edgeBufferTiles?: number;
        }
    }

    function preloadTiles(map: L.Map, tileLayerUrl: string) {
        const zoomLevels = [map.getZoom() - 1, map.getZoom() + 1]; // Preload tiles one level up/down
    
        zoomLevels.forEach((zoom) => {
            if (zoom < map.getMinZoom() || zoom > map.getMaxZoom()) return;
    
            const bounds = map.getPixelBounds();
            const tileSize = 256;
            const minX = Math.floor(bounds.getBottomLeft().x / tileSize);
            const maxX = Math.floor(bounds.getTopRight().x / tileSize);
            const minY = Math.floor(bounds.getTopRight().y / tileSize);
            const maxY = Math.floor(bounds.getBottomLeft().y / tileSize);
    
            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    const tileUrl = tileLayerUrl.replace('{z}', zoom.toString())
                                                .replace('{x}', x.toString())
                                                .replace('{y}', y.toString());
                    new Image().src = tileUrl; // Loads tiles in browser cache
                }
            }
        });
    }
    

export default function MainImage({ isOpen, wsiImage }: { isOpen: boolean; wsiImage: string }) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<L.Map | null>(null);
    const zoomControl = useRef<L.Control.Zoom | null>(null);
    // COULD CHANGE THIS TO BRING THE SIDEBAR FORWARD IF POSSIBLE (CHANGE LAYERING LIKE IN WORD DOCS)

    useEffect(() => {
        // Dynamically load the leaflet.edgebuffer.js script
        const script = document.createElement('script');
        script.src = '/leaflet.edgebuffer.js'; // Adjust the path if necessary
        script.async = true;
        script.onload = () => {
            console.log('leaflet.edgebuffer.js loaded');
        };
        document.head.appendChild(script);

        return () => {
            // Cleanup the script when the component unmounts
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (mapContainer.current && !map.current) {
            // Initialize the map only once
            // Use OpenSlide to get dimensions later on
            const wsiWidth = 382;  // Specify WSI width at level 8 (zoomed out - as reversed)
            const wsiHeight = 862; // Specify WSI height at level 8
            const imageBounds: L.LatLngBoundsExpression = [[0, 0], [-wsiHeight, wsiWidth]];

            // Initialize map
            map.current = L.map(mapContainer.current, {
                crs: L.CRS.Simple,
                maxZoom: 8,
                minZoom: 3,
                maxBounds: [[0, 0], [-wsiHeight, wsiWidth]],
                zoomControl: false, // Disable default zoom control
                boxZoom: false,
                keyboard: false,
                preferCanvas: true,
                zoomAnimationThreshold: 6,  // Keeps old tiles visible longer
                //zoomSnap: 0, //can use this to allow for any zoom level
            });

            // Create and store a zoom control instance
            zoomControl.current = L.control.zoom();

            // Add zoom control initially based on `isOpen`
            if (!isOpen && zoomControl.current) {
                zoomControl.current.addTo(map.current);
            }

            // Fit map to WSI dimensions
            map.current.fitBounds(imageBounds);
            map.current.setView([0, 0], 3);
            
            // -> /wsi/png/test_005.png -> wsi/tif/test_005.tif
            const wsiTif = wsiImage.replace('/wsi', 'wsi').replace('png', 'tif').replace('.png', '.tif');
            // Load tiles
            L.tileLayer(`http://localhost:8080/tiles/${wsiTif}/{z}/{x}/{y}.png`, {
                maxZoom: 8,
                minZoom: 3,
                attribution: 'WSI Image',
                tms: false,
                noWrap: true,
                bounds: imageBounds,
                keepBuffer: 8,      //keep loaded tiles in buffer for a while before discarded
                edgeBufferTiles: 5, //load tiles outside the current viewport
                updateWhenZooming: false,  // Prevents unnecessary tile updates mid-zoom
                updateWhenIdle: true,  // Ensures tiles are fetched immediately
            }).addTo(map.current);

            /* // Create three layers: current zoom, one above, one below
            const currentZoomLayer = createTileLayer("a", 0, wsiTif, imageBounds);
            const higherZoomLayer = createTileLayer("b", 1, wsiTif, imageBounds);
            const lowerZoomLayer = createTileLayer("c", -1, wsiTif, imageBounds);

            // Add all three layers to the map
            currentZoomLayer.addTo(map.current);
            higherZoomLayer.addTo(map.current);
            lowerZoomLayer.addTo(map.current);
            */

            // Trigger tile preloading when moving/zooming
            preloadTiles(map.current!, `http://localhost:8080/tiles/${wsiTif}/{z}/{x}/{y}.png`);
        }

        return () => {
            // Cleanup when component unmounts
            if (map.current) {
                map.current.off();
                map.current.remove();
                map.current = null;
            }
        };
        // The first react useEffect hook should not depend on isOpen, 
        // while the second one does depend on isOpen
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wsiImage]); // Only runs once, when the component mounts

    useEffect(() => {
        if (map.current && zoomControl.current) {
            // Toggle zoom control visibility dynamically
            if (isOpen) {
                map.current.removeControl(zoomControl.current); // Hide zoom control
            } else {
                map.current.addControl(zoomControl.current); // Show zoom control
            }
        }
    }, [isOpen]); // Runs whenever `isOpen` changes, to toggle the zoom control

    return (
        <>
            <div className={styles.map} ref={mapContainer} style={{ height: '90vh' }} />
        </>
    );
}