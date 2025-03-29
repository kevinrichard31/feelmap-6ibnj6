import { motion } from 'framer-motion';
import styles from './OnBoarding1.module.css';
import Steps from './Steps';
import { useBackgroundStore } from '../store/backgroundOnboarding';
import { useEffect, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { useGeolocationStore } from '../store/geolocation';

interface Props {
  onNext: () => void;
  onBack: () => void;
  currentStep: [number, number];
}

const OnBoarding4: React.FC<Props> = ({ onNext, onBack, currentStep }) => {
  const setBackgroundClass = useBackgroundStore((state) => state.setBackgroundClass);
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [loadingGeolocation, setLoadingGeolocation] = useState(false);
  const setGeolocation = useGeolocationStore((state) => state.setGeolocation);

  useEffect(() => {
    setBackgroundClass('background2-content');
  }, [setBackgroundClass]);

  const requestGeolocation = async () => {
    setLoadingGeolocation(true);
    try {
      const position = await Geolocation.getCurrentPosition({enableHighAccuracy: true});
      console.log("position");
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      setGeolocation(position.coords.latitude, position.coords.longitude);
      setGeolocationEnabled(true);
      setLoadingGeolocation(false);
      console.log("Géolocalisation activée avec succès !");
      onNext(); // Passe à l'étape suivante après l'activation réussie
    } catch (error: any) {
      console.error("Erreur lors de l'activation de la géolocalisation :", error);
      setGeolocationEnabled(false);
      setLoadingGeolocation(false);

      if (error.message.includes('denied')) {
        alert("L'accès à la géolocalisation a été refusé. Activez-là dans les paramètres de l'application si vous souhaitez l'activer.");
      } else if (error.message.includes('unavailable')) {
        alert("La géolocalisation n'est pas disponible sur cet appareil.");
      } else {
        alert("Une erreur s'est produite lors de l'activation de la géolocalisation.");
      }
       // Go to next screen even if denied or unavailable
      onNext();
    }
      console.log("🌱 - requestGeolocation - position:", position)
      console.log("🌱 - requestGeolocation - position:", position)
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <img src="./images/onboarding/iconright2.svg" alt="" className={styles['iconright']} />
        <div className={styles['title']} style={{ marginBottom: '15px' }}>
          Où te sens-tu 
          <br></br>
          <span className={styles['title-bold']}>vraiment bien ?</span>
        </div>
        <p className={styles['onboarding-p']}>Identifie les lieux qui boostent ton énergie et ceux qui te pèsent. Apprends à mieux choisir ton environnement.</p>
        <div className={styles['ob3traits-container']}>
          <img src="./images/onboarding/map.png" alt="" className={styles['map-image']} />
        </div>
        {/* Bouton "Suivant" */}
        <div className={styles['next-container']}>
          {/* <button onClick={onBack} className={styles['prev']}>Retour</button> */}
           <button
              onClick={requestGeolocation}
              className={styles['next-second-color']}
              disabled={loadingGeolocation}
              style={{marginTop: '20px'}}
            >
              {loadingGeolocation ? 'Activation...' : 'Suivant'}
            </button>
        </div>

      </motion.div>

      <div className={styles['step-container']}>
        <Steps currentStep={currentStep[0]} maxStep={currentStep[1]} />
      </div>
    </>
  );
};

export default OnBoarding4;