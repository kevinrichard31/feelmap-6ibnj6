'use client';
import React from 'react';
import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import { useTranslation } from 'react-i18next';
// import './permission.css'; // Consider removing if unused

const Permission: React.FC = () => {
    const router = useIonRouter();
    const { t } = useTranslation();

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <div style={{ padding: '15px' }}>
                    <img src="/images/back.svg" alt={t('permissionPage.backButtonAlt')} onClick={() => router.goBack()} />
                    <div className='describe-title'>{t('permissionPage.title')}</div>
                    <div>{t('permissionPage.intro')}</div>

                    <div className='describe-title'>{t('permissionPage.locationTitle')}</div>

                    <ul>
                        <li><strong>{t('permissionPage.locationWhyTitle')}</strong>: {t('permissionPage.locationWhyContent')}</li>
                        <li><strong>{t('permissionPage.locationHowTitle')}</strong>: {t('permissionPage.locationHowContent')}</li>
                        <li>{t('permissionPage.locationManage')}</li>
                    </ul>

                    <div className='describe-title'>{t('permissionPage.storageTitle')}</div>
                    <ul>
                        <li><strong>{t('permissionPage.storageWhyTitle')}</strong>: {t('permissionPage.storageWhyContent')}</li>
                        <li><strong>{t('permissionPage.storageHowTitle')}</strong>: {t('permissionPage.storageHowContent')}</li>
                    </ul>

                    <div><strong>{t('permissionPage.noteTitle')}</strong>: {t('permissionPage.noteContent')}</div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Permission;