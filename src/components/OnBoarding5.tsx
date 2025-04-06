import { motion } from 'framer-motion';
import styles from './OnBoarding1.module.css';
import Steps from './Steps';
import { useBackgroundStore } from '../store/backgroundOnboarding';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onNext: () => void;
  onBack: () => void;
  currentStep: [number, number];
}

const OnBoarding5: React.FC<Props> = ({ onNext, onBack, currentStep }) => {
  const setBackgroundClass = useBackgroundStore((state) => state.setBackgroundClass);
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
        <div className={styles['title']} style={{ paddingTop: '45px', marginBottom: '15px' }}>
          {t('Espace')}
          <br></br>
          <span className={styles['title-bold']}>{t('100% personnel')} 🔒</span>
        </div>
        <p className={styles['onboarding-p']}>{t('onboarding5text1')}</p>
        <div className={styles['ob3traits-container']}>
          <img src="./images/onboarding/shield.svg" alt="" className={styles['shield-image']} />
        </div>
        {/* Bouton "Suivant" */}
        <div className={styles['next-container']}>
          {/* <button onClick={onBack} className={styles['prev']}>Retour</button> */}
          <button onClick={onNext} className={styles['next-second-color']}>{t('Next')}</button>
        </div>

      </motion.div>

      <div className={styles['step-container']}>
        <Steps currentStep={currentStep[0]} maxStep={currentStep[1]} />
      </div>
    </>
  );
};

export default OnBoarding5;