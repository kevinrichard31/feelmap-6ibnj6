import React, { useEffect, useState } from 'react';
import './restoredata.css';

import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  useIonRouter,
} from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { verifyPassword } from '../utils/api';

const Restoredata: React.FC = () => {
  const router = useIonRouter();
  const [feelmapId, setFeelmapId] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setFeelmapId(id);
  }, []);

  const handlePasswordSubmit = async () => {
    if (!password) {
      setError(t('restoreData.idRequired'));
      return;
    }

    try {
      const userId = await verifyPassword(password);
      if (userId) {
        localStorage.setItem('userId', userId);
        localStorage.setItem('password', password);

        setMessage(t('restoreData.accountRestored'));
        setError(null);
        setFeelmapId(userId);
      } else {
        setError(t('restoreData.invalidId'));
        setMessage(null);
      }
    } catch (err) {
      setError(t('restoreData.genericError'));
      setMessage(null);
      console.error('Error during password verification:', err);
    }
  };

  const handleCopy = () => {
    if (feelmapId) {
      navigator.clipboard
        .writeText(feelmapId)
        .then(() => {
          setCopyMessage(t('restoreData.idCopied'));
          setTimeout(() => setCopyMessage(null), 2000);
        })
        .catch((err) => {
          setError(t('restoreData.copyError'));
          console.error('Error copying to clipboard:', err);
        });
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: '15px' }}>
          <img
            src="/images/back.svg"
            alt={t('restoreData.back')}
            onClick={() => history.goBack()}
          />
          <div className="describe-title">{t('restoreData.title')}</div>
          <br />
          <IonText>
            <p>{t('restoreData.description')}</p>
          </IonText>

          <IonItem>
            <IonLabel>{t('restoreData.idLabel')}</IonLabel>
            <IonInput
              type="text" // Or "password" if appropriate
              placeholder={t('restoreData.idPlaceholder')}
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            />
          </IonItem>

          <IonButton expand="full" onClick={handlePasswordSubmit}>
            {t('restoreData.validate')}
          </IonButton>

          {message && (
            <IonText color="success">
              <p>{message}</p>
            </IonText>
          )}
          {error && (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          )}
          {copyMessage && (
            <IonText color="primary">
              <p>{copyMessage}</p>
            </IonText>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Restoredata;