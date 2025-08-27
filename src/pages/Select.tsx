import { IonContent, IonPage, useIonRouter, useIonViewDidEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
import { emotions } from '../data/emotions';
import { useEmotion } from '../contexts/EmotionContext';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './Select.css';
import { useTranslation } from "react-i18next";
import i18n from 'i18next';
import Survey from '../components/Survey';
import { PermissionStatus, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';


const Select: React.FC = () => {
  const { setEmotion } = useEmotion();
  const routerLink = useIonRouter();
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const audio = new Audio('/pop.mp3');
  const { t } = useTranslation();


  useIonViewDidEnter(() => {

    //Request Permissions
    PushNotifications.requestPermissions().then((permission: PermissionStatus) => {
      if (permission.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register().then();
      } else {
        // No permission for push granted
      }
    });

    //Registration in firebase
    PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        //TODO:THE TOKEN IS RECEIVED AFTER A SUCCESSFUL AUTHENTICATION IS ACHIEVED
        console.log('My token: ' + JSON.stringify(token));
      }
    );

    //Subscribed notifications
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        //TODO: THIS IS WHERE THE NOTIFICATION IS CAPTURED (BACKGROUND)
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );
  });

  const handleClick = (emotion: string, image: string, background: string) => {
    setEmotion(emotion, image, background, 0, 0);
    routerLink.push('/describe', 'forward');
  };

  const handlePointerStart = (event: React.TouchEvent) => {
    setIsPointerDown(true);
    const targetElement = event.target as HTMLElement;
    const emojiElement = targetElement.classList.contains('container-emoji-single')
      ? targetElement
      : targetElement.closest('.container-emoji-single') as HTMLElement;
    if (emojiElement) {
      const emotionName = emojiElement.querySelector('.emotion-name')?.textContent || '';
      audio.play();
      if (emotionName !== selectedEmotion) {
        setSelectedEmotion(emotionName);
      }
      const allElements = document.querySelectorAll('.container-emoji-single');
      allElements.forEach((el) => {
        el.classList.remove('active2');
      });
      emojiElement.classList.add('active2');
    }
  };

  const handlePointerEnd = () => {
    setIsPointerDown(false);
    const allElements = document.querySelectorAll('.container-emoji-single');
    allElements.forEach((el) => {
      el.classList.remove('active');
      el.classList.remove('active2');
    });
  };

  const handlePointerMove = (event: React.TouchEvent) => {
    if (isPointerDown) {
      const { clientX, clientY } = event.touches[0];
      const elementUnderFinger = document.elementFromPoint(clientX, clientY);
      const targetElement = elementUnderFinger?.classList.contains('container-emoji-single')
        ? elementUnderFinger
        : elementUnderFinger?.closest('.container-emoji-single');
      if (targetElement) {
        const emotionName = targetElement.querySelector('.emotion-name')?.textContent || '';
        if (emotionName !== selectedEmotion) {
          audio.play();
          setSelectedEmotion(emotionName);
        }
        const allElements = document.querySelectorAll('.container-emoji-single');
        allElements.forEach((el) => {
          el.classList.remove('active');
          el.classList.remove('active2');
        });
        targetElement.classList.add('active');
      }
    }
  };

  return (
    <IonPage>
      <Survey />
      <IonContent
        fullscreen
        className='background-content'
        forceOverscroll={false}
      >
        <div className="emotion-selector">
          <div className="title">
            {t('howdoyoufeel')}, <br /> <span className='bold'>{t('now')}</span>
          </div>
          <div className="choose-emotion">
            {t('chooseyouremotion')} <img src="images/arrow-down.svg" alt="" className="arrow-down" />
          </div>

          <div className="wrap-emoji"
            onTouchStart={handlePointerStart}
            onTouchEnd={handlePointerEnd}
            onTouchMove={handlePointerMove}
          >
            {emotions.map(({ name, image, imageStatic, background, color }) => (
              <div
                key={name}
                className='container-emoji-single'
                onClick={() => handleClick(name, imageStatic, background)}
              >
                <svg
                  className='box'
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 200"
                  width="100%"
                  style={{
                    filter: 'drop-shadow(0 1px 1px hsl(0deg 0% 0% / 0.075)) drop-shadow(0 2px 2px hsl(0deg 0% 0% / 0.075)) drop-shadow(0 4px 4px hsl(0deg 0% 0% / 0.075)) drop-shadow(0 8px 8px hsl(0deg 0% 0% / 0.075)) drop-shadow(0 16px 16px hsl(0deg 0% 0% / 0.075))'
                  }}
                >
                  <path
                    d="M 0, 100 C 0, 12 12, 0 100, 0 S 200, 12 200, 100 188, 200 100, 200 0, 188 0, 100"
                    fill={color}
                  ></path>
                </svg>
                <div className='container-content'>
                  {/* <DotLottieReact src={image} loop autoplay /> */}
                  <img src={imageStatic} alt="" className='emotion-image' />
                  <div style={{ marginTop: '3px' }} className='emotion-name'>{t(name)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Select;
