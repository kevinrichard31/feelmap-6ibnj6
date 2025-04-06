import React from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonBackButton, IonButtons } from '@ionic/react';
import { arrowBackOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import styles from './Confidentialite.module.css';
import { useTranslation } from 'react-i18next';

const Confidentialite: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonContent className="ion-padding">
      <img src="/images/back.svg" alt={t('general.back')} onClick={() => history.goBack()} />
        <div className={styles['describe-title']}>
          {t('confidentialite.title')}
        </div>
        <div className={styles['describe-title']}>{t('confidentialite.last_updated')}</div>
        <div>
          {t('confidentialite.intro')}
        </div>

        <div className={styles['describe-title']}>{t('confidentialite.data_collection_title')}</div>
        <div>{t('confidentialite.data_collection_intro')}</div>
        <div>
          {t('confidentialite.location_data')}
        </div>
        <div>
          {t('confidentialite.content_data')}
        </div>

        {/* Le reste du contenu reste inchangé */}
        <div className={styles['describe-title']}>{t('confidentialite.data_storage_title')}</div>
        <div>
          {t('confidentialite.data_storage_content')}
        </div>
        <div>{t('confidentialite.cookie_duration')}</div>

        <div className={styles['describe-title']}>{t('confidentialite.data_usage_title')}</div>
        <div>{t('confidentialite.data_usage_intro')}</div>
        <div>{t('confidentialite.usage_location')}</div>
        <div>{t('confidentialite.usage_management')}</div>
        <div>{t('confidentialite.usage_calendar')}</div>
        <div>{t('confidentialite.data_sharing')}</div>

        <div className={styles['describe-title']}>{t('confidentialite.data_access_title')}</div>
        <div>{t('confidentialite.data_access_content')}</div>

        <div className={styles['describe-title']}>{t('confidentialite.data_retention_title')}</div>
        <div>{t('confidentialite.data_retention_content')}</div>

        <div className={styles['describe-title']}>{t('confidentialite.data_deletion_title')}</div>
        <div>{t('confidentialite.data_deletion_content')}</div>

        <div className={styles['describe-title']}>{t('confidentialite.data_deletion_other_account')}</div>

        <div className={styles['describe-title']}>{t('confidentialite.data_security_title')}</div>
        <div>{t('confidentialite.data_security_content')}</div>

        <div className={styles['describe-title']}>{t('confidentialite.policy_changes_title')}</div>
        <div>{t('confidentialite.policy_changes_content')}</div>

        <div className={styles['describe-title']}>{t('confidentialite.contact_title')}</div>
        <div>{t('confidentialite.contact_content')}</div>

        <div className={styles['describe-title']}>{t('confidentialite.disclaimer_title')}</div>
        <div>{t('confidentialite.disclaimer_content')}</div>
      </IonContent>
    </IonPage>
  );
};

export default Confidentialite;