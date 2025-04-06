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

const OnBoardingInformations: React.FC<Props> = ({ onNext, currentStep }) => {
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

        <p className={`${styles['subtitle']} ${styles['onboarding-p']}`}>🔔 {t('Important information')}</p>
        <p className={styles['onboarding-p']}>{t('informationtext1')} </p>
        {/* Bouton "Suivant" */}

        <p className={styles['onboarding-p']}>{t('informationtext2')}</p>
        <div className={styles['next-container']}>
          <button onClick={onNext} className={styles['next']}>{t('I understand')}</button>
        </div>



      </motion.div>
      <div className={styles['step-container']}>
        <Steps currentStep={currentStep[0]} maxStep={currentStep[1]} />
      </div>
    </>
  );
};

export default OnBoardingInformations;
