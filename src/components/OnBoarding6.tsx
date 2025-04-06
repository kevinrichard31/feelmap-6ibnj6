import { motion } from 'framer-motion';
import styles from './OnBoarding1.module.css';
import Steps from './Steps';
import { useBackgroundStore } from '../store/backgroundOnboarding';
import { useEffect } from 'react';
import { useIonRouter } from '@ionic/react';
import { useTranslation } from 'react-i18next';

interface Props {
  onNext: () => void;
  onBack: () => void;
  currentStep: [number, number];
}

const OnBoarding6: React.FC<Props> = ({ onNext, onBack, currentStep }) => {
  const setBackgroundClass = useBackgroundStore((state) => state.setBackgroundClass);
  const router = useIonRouter();
  const { t } = useTranslation();
  useEffect(() => {
    setBackgroundClass('background2-content');
  }, [setBackgroundClass]); // Ajoute setBackgroundClass comme dépendance pour éviter des problèmes de closure.

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
        {t('Prêt(e) à explorer ')}
          <br></br>
          <span className={styles['title-bold']}>{t('tes émotions ?')} 🚀</span>
        </div>
        <p className={styles['onboarding-p']}>{t('onboarding6text1')}</p>
        <div className={styles['ob3traits-container']}>
          <img src="./images/onboarding/emojis.svg" alt="" className={styles['shield-image']} />
        </div>
        {/* Bouton "Suivant" */}
        <div className={styles['next-container']}>
          {/* <button onClick={onBack} className={styles['prev']}>Retour</button> */}
          <button onClick={onNext} className={styles['next-second-color']} style={{marginTop: '0px'}}>{t(`C'est parti !`)}</button>
        </div>

      </motion.div>

      <div className={styles['step-container']}>
        <Steps currentStep={currentStep[0]} maxStep={currentStep[1]} />
      </div>
    </>
  );
};

export default OnBoarding6;