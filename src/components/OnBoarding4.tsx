import { motion } from 'framer-motion';
import styles from './OnBoarding1.module.css';
import Steps from './Steps';
import { useBackgroundStore } from '../store/backgroundOnboarding';
import { useEffect, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { useGeolocationStore } from '../store/geolocation';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  useEffect(() => {
    setBackgroundClass('background2-content');
  }, [setBackgroundClass]);

  const requestGeolocation = async () => {
    setLoadingGeolocation(true);
    try {
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      console.log("position");
      console.log(position.coords.latitude);
      console.log(position.coords.longitude);
      setGeolocation(position.coords.latitude, position.coords.longitude);
      setGeolocationEnabled(true);
      setLoadingGeolocation(false);
      console.log(t("Géolocalisation activée avec succès !"));
      onNext();
    } catch (error: any) {
      console.error(t("Erreur lors de l'activation de la géolocalisation :"), error);
      setGeolocationEnabled(false);
      setLoadingGeolocation(false);

      if (error.message.includes('denied')) {
        alert(t("L'accès à la géolocalisation a été refusé. Activez-la dans les paramètres de l'application si vous souhaitez l'activer."));
      } else if (error.message.includes('unavailable')) {
        alert(t("La géolocalisation n'est pas disponible sur cet appareil."));
      } else {
        alert(t("Une erreur s'est produite lors de l'activation de la géolocalisation."));
      }

      onNext();
    }
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
          {t('Où te sens-tu')}
          <br />
          <span className={styles['title-bold']}>{t('vraiment bien ?')}</span>
        </div>
        <p className={styles['onboarding-p']}>{t('onboarding4text1')}</p>
        <div className={styles['ob3traits-container']}>
          <img src="./images/onboarding/map.png" alt={t("Carte")} className={styles['map-image']} />
        </div>
        <div className={styles['next-container']}>
          <button
            onClick={requestGeolocation}
            className={styles['next-second-color']}
            disabled={loadingGeolocation}
            style={{ marginTop: '20px' }}
          >
            {loadingGeolocation ? t('Activation...') : t('Suivant')}
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
