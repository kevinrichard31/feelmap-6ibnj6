'use client';
import React from 'react';
import './utilisation.css';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage } from '@ionic/react';
import { useTranslation } from 'react-i18next';

const Utilisation: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();
    //const terms = t('termsOfUse'); // No need for this line

    return (
        <IonPage>
            <IonContent>
                <div style={{ padding: '15px' }}>
                    <img src="/images/back.svg" alt="Retour" onClick={() => history.goBack()} />
                    <div className='describe-title'>{t('termsOfUse.title')}</div><br />
                    <div>{t('termsOfUse.lastUpdate')}</div><br />

                    <div>{t('termsOfUse.intro')}</div>

                    <div className='describe-title'>{t('termsOfUse.purposeTitle')}</div>
                    <div>{t('termsOfUse.purposeContent')}</div>
                    <ul>
                        <li>{t('termsOfUse.purposeList.1')}</li>
                        <li>{t('termsOfUse.purposeList.2')}</li>
                        <li>{t('termsOfUse.purposeList.3')}</li>
                        <li>{t('termsOfUse.purposeList.4')}</li>
                    </ul>

                    <div className='describe-title'>{t('termsOfUse.usageTitle')}</div>
                    <ol>
                        <li>{t('termsOfUse.usageList.1')}</li>
                        <li>{t('termsOfUse.usageList.2')}</li>
                        <li>{t('termsOfUse.usageList.3')}</li>
                        <li>{t('termsOfUse.usageList.4')}</li>
                    </ol>

                    <div className='describe-title'>{t('termsOfUse.dataTitle')}</div>
                    <div>{t('termsOfUse.dataIntro')}</div>

                    <div>
                        <ul>
                            <li>{t('termsOfUse.dataList.location')}</li>
                            <li>{t('termsOfUse.dataList.content')}</li>
                        </ul>
                    </div>

                    <div>{t('termsOfUse.dataNote')}</div>

                    <div className='describe-title'>{t('termsOfUse.userResponsibilityTitle')}</div>
                    <ul>
                        <li>{t('termsOfUse.userResponsibilityList.1')}</li>
                        <li>{t('termsOfUse.userResponsibilityList.2')}</li>
                        <li>{t('termsOfUse.userResponsibilityList.3')}</li>
                    </ul>

                    <div className='describe-title'>{t('termsOfUse.deletionTitle')}</div>
                    <div>{t('termsOfUse.deletionContent')}</div>

                    <div className='describe-title'>{t('termsOfUse.intellectualPropertyTitle')}</div>
                    <div>{t('termsOfUse.intellectualPropertyContent')}</div>

                    <div className='describe-title'>{t('termsOfUse.liabilityTitle')}</div>
                    <div>{t('termsOfUse.liabilityContent')}</div>

                    <div className='describe-title'>{t('termsOfUse.modificationTitle')}</div>
                    <div>{t('termsOfUse.modificationContent')}</div>

                    <div className='describe-title'>{t('termsOfUse.contactTitle')}</div>
                    <div>{t('termsOfUse.contactContent')}</div>

                    <div className='describe-title'>{t('termsOfUse.disclaimerTitle')}</div>
                    <div>{t('termsOfUse.disclaimerContent')}</div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Utilisation;