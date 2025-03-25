import { motion } from 'framer-motion';
import styles from './OnBoarding1.module.css';
import Steps from './Steps';
import { useEffect } from 'react';
import { useBackgroundStore } from '../store/backgroundOnboarding';

interface Props {
  onNext: () => void;
  currentStep: [number, number];
}

const OnBoardingInformations: React.FC<Props> = ({ onNext, currentStep }) => {
  const setBackgroundClass = useBackgroundStore((state) => state.setBackgroundClass);

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

        <p className={`${styles['subtitle']} ${styles['onboarding-p']}`}>🔔 Information Importante</p>
        <p className={styles['onboarding-p']}>Les textes, contenus et indicateurs (positifs ou négatifs) affichés dans cette application sont présentés à des fins purement ludiques et de divertissement. Ils ne doivent en aucun cas être interprétés comme des données médicales, scientifiques, psychologiques ou de tout autre domaine professionnel. Ils sont générés par un algorithme à des fins de divertissement et ne reflètent pas une réalité médicale ou un avis professionnel. Pour toute question ou préoccupation liée à votre santé physique ou mentale, ou nécessitant un avis expert, consultez un professionnel qualifié.</p>
        {/* Bouton "Suivant" */}
        <div className={styles['next-container']}>
          <button onClick={onNext} className={styles['next']}>Je comprends</button>
        </div>



      </motion.div>
      <div className={styles['step-container']}>
        <Steps currentStep={currentStep[0]} maxStep={currentStep[1]} />
      </div>
    </>
  );
};

export default OnBoardingInformations;
