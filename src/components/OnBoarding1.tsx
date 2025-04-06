import { motion } from 'framer-motion';
import styles from './OnBoarding1.module.css';
import Steps from './Steps';
import { useEffect } from 'react';
import { useBackgroundStore } from '../store/backgroundOnboarding';
import { useTranslation } from 'react-i18next';

interface Props {
  onNext: () => void;
  currentStep: [number, number];
}

const OnBoarding1: React.FC<Props> = ({ onNext, currentStep }) => {
  const setBackgroundClass = useBackgroundStore((state) => state.setBackgroundClass);
  const { t } = useTranslation();
  useEffect(() => {
    setBackgroundClass('background1-content');
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
        <div className={styles['title']}>{t('Bienvenue dans')} <br></br>
          <span className={styles['title-bold']}>Feelmap</span>
        </div>
        <p className={`${styles['subtitle']} ${styles['onboarding-p']}`}>{t('onboardingtext1')}</p>
        <p className={styles['onboarding-p']}>{t('onboardingtext2')}</p>

        {/* Bouton "Suivant" */}
        <div className={styles['next-container']}>
          <button onClick={onNext} className={styles['next']}>{t('Next')}</button>
        </div>

        

      </motion.div>
      <div className={styles['step-container']}>
        <Steps currentStep={currentStep[0]} maxStep={currentStep[1]} />
      </div>
    </>
  );
};

export default OnBoarding1;
