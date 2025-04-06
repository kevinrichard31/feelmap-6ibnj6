'use client';
import React, { useEffect, useState } from 'react';

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
  IonAlert,
  useIonRouter
} from '@ionic/react';
import { arrowBackOutline, warningOutline } from 'ionicons/icons';
import { deleteUserData } from '../utils/api'; // Adjust the path as needed
import { useHistory } from 'react-router-dom'; // Correct import for Ionic
import { useTranslation } from 'react-i18next';

const Erasedata: React.FC = () => {
  const router = useIonRouter();
  const [feelmapId, setFeelmapId] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false); // Control the alert
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    // Retrieve credentials from localStorage
    const storedPassword = localStorage.getItem('password');
    const userId = localStorage.getItem('userId');
    setPassword(storedPassword);
    setFeelmapId(userId);
  }, []);

  const handleDelete = async () => {
    setShowAlert(false); // Close the alert

    if (password) {
      try {
        const result = await deleteUserData(password); // Call the API to delete data
        if (result) {
          setMessage(t('erase_data.success_message'));
          setError(null); // Clear any previous errors
          localStorage.removeItem('password'); // Optionally clear localStorage
          localStorage.removeItem('userId');
        } else {
          setError(t('erase_data.deletion_error'));
          setMessage(null); // Clear any previous messages
        }
      } catch (err) {
        setError(t('erase_data.deletion_error'));
        setMessage(null); // Clear any previous messages
        console.error("Error during data deletion:", err);
      }
    } else {
      setError(t('erase_data.no_password_found'));
      setMessage(null);
    }
  };

  const handleCancel = () => {
    router.push('/params'); // Redirect to /params
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div style={{ padding: '15px' }}>
        <img src="/images/back.svg" alt={t('general.back')} onClick={() => history.goBack()} />
        <div className='describe-title'>{t('erase_data.title')}</div><br />
      
          <IonText>
            <p>{t('erase_data.confirmation_text')}</p>
          </IonText>

          {error && <IonText color="danger"><p>{error}</p></IonText>}
          {message && <IonText color="success"><p>{message}</p></IonText>}

          <IonButton expand="full" color="danger" onClick={() => setShowAlert(true)}>
            {t('erase_data.confirm_delete_button')}
          </IonButton>

          <IonButton expand="full" onClick={handleCancel}>
            {t('erase_data.cancel_button')}
          </IonButton>

          <IonText>
            <p className='info'>{t('erase_data.info_text')}</p>
          </IonText>

          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={t('erase_data.alert_header')}
            message={t('erase_data.alert_message')}
            buttons={[
              {
                text: t('general.cancel'),
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Suppression annulée');
                }
              }, {
                text: t('erase_data.alert_confirm_delete'),
                handler: () => {
                  handleDelete();
                }
              }
            ]}
          />

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Erasedata;