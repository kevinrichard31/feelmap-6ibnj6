import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IonContent, IonPage, IonButton, IonTextarea, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import { useIonRouter } from '@ionic/react';
import { useEmotion } from '../contexts/EmotionContext';
import { saveEmotion, getCityFromBDC, getAmenityFromNominatim } from '../utils/api';
import { useTranslation } from 'react-i18next';
import { Geolocation } from '@capacitor/geolocation';
import styles from './Goals.module.css';


const GoalsChoice: React.FC = () => {

  const router = useIonRouter();
  const { t } = useTranslation();






  return (
    <IonPage className="describe">
      <IonContent forceOverscroll={false}>
        <div className={styles['content-container']}>
          <div className={styles['header-image']}>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GoalsChoice;