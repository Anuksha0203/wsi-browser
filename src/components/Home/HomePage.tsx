'use client';
import 'react';
//import { useEffect, useState } from 'react';
import Header from '../Header/Header';
import styles from './HomePage.module.css';
import Image from 'next/image'
import Link from 'next/link';
import mockData from '../mockData.json';

function HomePage() {

    /*const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchMessage = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/hello');
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error('Error fetching message:', error);
        }
        };

        fetchMessage();
    }, []);*/

    return ( 
        <>
        <Header/>
        <div>
            <div className={styles.containerText}>
                <h1 className={styles.text}>WSI Browser</h1>
                <p className={styles.subtext}>Website Info...</p>
                {/*<div>
                    <p className={styles.subtext}>{message}</p>
                </div>*/}
            </div>
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
        </div>
        </>
    );
}
export default HomePage