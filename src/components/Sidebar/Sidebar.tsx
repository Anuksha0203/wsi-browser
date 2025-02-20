import React from "react";
import styles from "./Sidebar.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image'
import Link from 'next/link';
import mockData from '../mockData.json';
import { useSearchParams } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  position: "left" | "right";
}

function checkButton(isOpen, position) {
  if (position === "left") {
    return isOpen ? (<FontAwesomeIcon icon={faCaretLeft} />) : (<FontAwesomeIcon icon={faCaretRight} />);
  }
  if (position === "right") {
    return isOpen ? (<FontAwesomeIcon icon={faCaretRight} />) : (<FontAwesomeIcon icon={faCaretLeft} />);
  }
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpen, position }) => {

  // Use useSearchParams to get the query parameters
  const searchParams = useSearchParams();
  const image = searchParams ? searchParams.get("image") : null;
  // Find the WSI from mockData based on the image being viewed
  const currentWSI = mockData.find((wsi) => wsi.image === image);

  return (
    <div className={`${isOpen ? styles.open : ""}  ${
        position === "left" ? styles.sidebarLeft : styles.sidebarRight}`}>
      <button className={`${position === "left" ? styles.leftEdgeButton : styles.rightEdgeButton}`} onClick={isOpen ? onClose : onOpen}>
        {checkButton(isOpen, position)}
      </button>
      {isOpen && (
        <div className={styles.sidebarContent}>
          {/* Sidebar headers */}
          <div className={styles.sidebarHeader}>
            {position === "left" ? "WSI Images" : "Layers"}
          </div>
          {position === "left" ? (mockData.map(wsi => (
            <div key={wsi.id} className="imageItem">
                <Link href={`/annotate?image=${encodeURIComponent(wsi.image)}`}>
                <Image
                    src={wsi.image}
                    width={200}
                    height={200}
                    alt={wsi.alt}
                />
                </Link>
                <p>{wsi.description}</p>
            </div>
          ))) : (
            // Right Sidebar Content: Layers for the current WSI
            currentWSI && currentWSI.layers ? (
              Object.entries(currentWSI.layers).map(([key, layerName]) => (
                <div key={`${currentWSI.id}-${key}`} className={styles.layerItem}>
                  <span className={styles.layerIcon}></span> {/* Placeholder icon */}
                  <span className={styles.layerName}>{layerName}</span>
                </div>
              ))
            ) : (
              <p>No layers available</p>
            )
          )}
          
        </div>
      )}
    </div>
  );
};

export default Sidebar;
