'use client';
import 'react';
import Header from '../Header/Header';
import styles from './Wsicatalogue.module.css';
import mockData from '../mockData.json';
import Image from 'next/image'
import Link from 'next/link';

function Wsicatalogue() {

    return ( 
        <>
            <Header/>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.th}>Name</th>
                        <th className={styles.th}>Image</th>
                        <th className={styles.th}>Metadata</th>
                    </tr>
                </thead>
                <tbody>
                    {mockData.map(wsi => (
                        <tr key={wsi.id}>
                            <td className={styles.td}>
                                <Link href={`/annotate?image=${encodeURIComponent(wsi.image)}`}>
                                    {wsi.name}
                                </Link>
                            </td>
                            <td className={styles.td}>
                                <Image
                                    src={wsi.image}
                                    width={200}
                                    height={200}
                                    alt={wsi.alt}
                                />
                            </td>
                            <td className={styles.td}>{wsi.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
export default Wsicatalogue