'use client';
import 'react';
import { useState, useMemo, useEffect } from "react";
import Head from 'next/head';
import Sidebar from "../Sidebar/Sidebar";
import Header from '../Header/Header';
import dynamic from 'next/dynamic';
import { useSearchParams } from "next/navigation"; //instead of useRouter as NextJS 15 being used
import styles from './MainImage.module.css';
import headerStyles from '../Header/Header.module.css';
import mockData from './mockData.json';
import Image from 'next/image'
import Link from 'next/link';

function Annotate() {

    const [isVisible, setIsVisible] = useState(false);

    const handleMouseEnter = () => {
        setIsVisible(true); // Show header when hovering over the top area
    };

    const handleMouseLeave = () => {
        setIsVisible(false); // Hide header when leaving the top area
    };
    
    //const arrowUp = <FontAwesomeIcon icon={faArrowUp}style={{fontSize: '1.3rem', color: 'var(--brand-100)'}} />
    //const arrowDown = <FontAwesomeIcon icon={faArrowDown}style={{fontSize: '1.3rem', color: 'var(--brand-100)'}} />
    //CAN CHANGE THIS TO HOVER ON SIDE MENUS INSTEAD OF HAVING TO CLICK
    const [leftOpenedSideBar, setLeftOpenedSideBar] = useState(false);
    const [rightOpenedSideBar, setRightOpenedSideBar] = useState(false);
    
    const [imageExists, setImageExists] = useState(false);

    // Use useSearchParams to get the query parameters
    const searchParams = useSearchParams();
    const image = searchParams ? searchParams.get("image") : null;
    console.log(image) ///wsi/png/test_005.png


    const closeLeftSidebar = () => setLeftOpenedSideBar(false);
    const closeRightSidebar = () => setRightOpenedSideBar(false);

    const getIdByImage = (image_path) => {
        console.log("1" + image_path)
        const foundItem = mockData.find((item) => item.image === image_path);
        return foundItem ? foundItem.name : null;
    };

    //Dynamically import MainImage without SSR
    const MainImage = useMemo(() => dynamic(() => import('./MainImage'), { 
        ssr: false,
        loading: () => <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{
            width: "50px",
            height: "50px",
            border: "5px solid #ccc",
            borderTop: "5px solid #000",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
        }} />
        <p style={{ marginTop: "20px", fontSize: "18px", color: "#333" }}>Loading Map...</p>
        <style>
            {`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            `}
        </style>
    </div>
    }), []);

    useEffect(() => {
        if (!image) {
            console.log("Image parameter is missing!");
        }
        else {
            setImageExists(true);
        }
    }, [image]);

    return imageExists ? ( 
        <>
        <div
        className={headerStyles["hover-area"]}
        onMouseEnter={handleMouseEnter}
      ></div>

      {/* Header Wrapper */}
      <div
        className={`${headerStyles.headerWrapper} ${
          isVisible ? headerStyles.visible : ""
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <Header />
      </div>
        
        
        {image && (
            <div>
                <p className={styles.subtext}>{getIdByImage(image)}</p>
            </div>
        )}
        <Sidebar isOpen={leftOpenedSideBar} onClose={closeLeftSidebar} onOpen={() => setLeftOpenedSideBar(true)} position={'left'} />
        <Head>
            <link 
                rel="stylesheet" 
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />
            <script 
                src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
                crossOrigin=""
                defer // Use defer to ensure the script loads after the page content
            />
        </Head>
        <div id="mainImage">
            <MainImage isOpen={leftOpenedSideBar} wsiImage={image || ""} />
        </div>
        <Sidebar isOpen={rightOpenedSideBar} onClose={closeRightSidebar} onOpen={() => setRightOpenedSideBar(true)} position={'right'} />
        </>
    ) : (
    <>
    <Header/>
    <div className={styles.containerImageGrid}>
        {mockData.map(wsi => (
        <div key={wsi.id} className="imageItem">
            <Link href={`/annotate?image=${encodeURIComponent(wsi.image)}`}>
            <Image
                src={wsi.image}
                width={500}
                height={500}
                alt={wsi.alt}
            />
            </Link>
            <p>{wsi.description}</p>
        </div>
        ))}
    </div>
    </>
    )
}
export default Annotate