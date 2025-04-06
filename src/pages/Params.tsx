import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  useIonRouter,
} from '@ionic/react';

import { useEffect, useState } from 'react';
import { arrowBackOutline, copyOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import styles from './Params.module.css';
import { useTranslation } from 'react-i18next';

const Params: React.FC = () => {
  const [feelmapId, setFeelmapId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const history = useHistory();
  const router = useIonRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const id = localStorage.getItem('password');
    setFeelmapId(id);
  }, []);

  const handleCopy = () => {
    if (feelmapId) {
      navigator.clipboard
        .writeText(feelmapId)
        .then(() => {
          setCopyMessage(t('params.idCopied'));
          setTimeout(() => setCopyMessage(null), 2000);
        })
        .catch((err) => {
          setError(t('params.copyError'));
        });
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: '15px', paddingTop: '50px' }}>
          <img
            src="/images/back.svg"
            alt={t('params.back')}
            className={styles['back-img']}
            onClick={() => history.goBack()}
          />
          <div className={styles['describe-title']}>{t('params.title')}</div>

          <div className={styles['container-id-copy']}>
            <div className={styles['container-id']}>
              <div className={styles['describe-title2']}>
                {t('params.myFeelmapId')}
              </div>
              <div className={styles['feelmap-id']}>
                {feelmapId ? feelmapId : t('params.notAvailable')}
              </div>
            </div>
            <IonButton className={styles['button-copy']} onClick={handleCopy}>
              {t('params.copy')}
              <IonIcon icon={copyOutline} slot="end" />
            </IonButton>
          </div>

          {copyMessage && (
            <div className={styles['copy-message']}>{copyMessage}</div>
          )}
          {error && <div className={styles['error-message']}>{error}</div>}

          <IonText>
            <p>{t('params.idDescription')}</p>
          </IonText>

          <IonItem
            button
            onClick={() => router.push('/restoredata')}
            style={{ paddingLeft: 0 }}
          >
            <IonLabel className={styles['describe-title']}>
              {t('params.restoreData')}
            </IonLabel>
          </IonItem>

          <IonItem
            button
            onClick={() => router.push('/erasedata')}
            style={{ paddingLeft: 0 }}
          >
            <IonLabel className={styles['describe-title']}>
              {t('params.eraseData')}
            </IonLabel>
          </IonItem>
        </div>
        <hr />

        <div style={{ padding: '15px' }}>
          <IonText>
            <p>{t('params.cookieDescription')}</p>
          </IonText>
          <hr />
          <IonItem button onClick={() => router.push('/params/confidentialite')}>
            <IonLabel className={styles['describe-title']}>
              {t('params.privacyPolicy')}
            </IonLabel>
          </IonItem>
          <IonItem button onClick={() => router.push('/params/utilisation')}>
            <IonLabel className={styles['describe-title']}>
              {t('params.termsOfUse')}
            </IonLabel>
          </IonItem>
          <IonItem button onClick={() => router.push('/params/permission')}>
            <IonLabel className={styles['describe-title']}>
              {t('params.permissions')}
            </IonLabel>
          </IonItem>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Params;