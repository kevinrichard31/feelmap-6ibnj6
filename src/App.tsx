import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonRouterLink,
  setupIonicReact,
  IonFab,
  IonFabButton,
  useIonRouter,
  isPlatform
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, location, calendarNumber, settingsOutline, settings, people, personAdd, person, barChart, pieChart, analytics, addCircle, calendarOutline, locationOutline } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Calendar from './pages/Calendar';
import Params from './pages/Params';
import Stats from './pages/Stats'

import './theme/variables.css';
import './theme/global.css';
import { EmotionProvider } from './contexts/EmotionContext';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
// import '@ionic/react/css/palettes/dark.always.css';
import Select from './pages/Select';
import Describe from './pages/Describe';
import { checkUserExists, createUser } from './utils/api';
import EmotionDetail from './pages/EmotionDetail';
import { Device } from '@capacitor/device';
import { Keyboard } from '@capacitor/keyboard';
import SelectPlace from './pages/SelectPlace';
import i18n from './i18n';
import Restoredata from './pages/Restoredata';
import Erasedata from './pages/Erasedata';
import Confidentialite from './pages/Confidentialite';
import Utilisation from './pages/Utilisation';
import Permission from './pages/Permission';
import OnBoarding from './pages/OnBoarding/OnBoarding';
import { createAnimation } from '@ionic/react';
import Survey from './components/Survey';
import TimeSpent from './components/TimeSpent';
import Goals from './pages/Goals';
import GoalsChoice from './pages/GoalsChoice';
declare global {
  interface Window {
    ClarityPlugin?: any;
  }
}

setupIonicReact();

const initializeClarity = () => {
  const success = (message: string) => console.log("Clarity initialized:", message);
  const failure = (message: string) => console.error("Clarity initialization failed:", message);

  if (isPlatform('android') && window.ClarityPlugin) {
    window.ClarityPlugin.initialize("qrq4x25xym", success, failure, { isIonic: true });
  } else {
    console.warn("ClarityPlugin is not available or not on Android platform.");
  }
};

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const router = useIonRouter();
  const [activeTab, setActiveTab] = useState('tab1'); // Initialize with a default tab

  const enterAnimation = (baseEl: any) => {
    const root = baseEl.shadowRoot || baseEl;

    const animation = createAnimation()
      .addElement(root.querySelector('.ion-page'))
      .duration(500)
      .easing('ease-out')
      .fromTo('transform', 'translateX(100%)', 'translateX(0%)')
      .fromTo('opacity', '0', '1');

    return animation;
  };

  useEffect(() => {
    console.log('initialisation clarity')
    initializeClarity();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        // 1. D'abord, récupérer la langue
        const { value: userLocale } = await Device.getLanguageCode();
        i18n.changeLanguage(userLocale || 'en');
        console.log("🌱 - Device.getLanguageCode - locale:", userLocale);
        // 2. Vérifier l'utilisateur existant
        const storedUserId = localStorage.getItem('userId');
        const storedPassword = localStorage.getItem('password');
        if (!storedUserId) {
          // 3. Créer un nouvel utilisateur si nécessaire
          const { id, password } = await createUser(userLocale);
          if (id) {
            localStorage.setItem('userId', id);
            localStorage.setItem('password', password);
            console.log('User ID stored:', id);
          }
        } else {
          // 4. Vérifier si l'utilisateur existe dans la base de données
          const exists = await checkUserExists(storedUserId);
          if (!exists) {
            localStorage.removeItem('userId');
            localStorage.removeItem('password');
            console.log('User ID and password removed from localStorage');
            // Recréer un nouvel utilisateur
            const { id, password } = await createUser(userLocale);
            if (id) {
              localStorage.setItem('userId', id);
              localStorage.setItem('password', password);
              console.log('New user ID stored:', id);
            }
          } else {
            console.log('User ID exists in the database:', storedUserId);
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    (function (h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
      h._hjSettings = { hjid: 6377552, hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script'); r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

    const setupKeyboardListeners = async () => {
      // Only set up keyboard listeners on mobile platforms
      if (isPlatform('ios') || isPlatform('android')) {
        const showKeyboardHandler = () => {
          setIsKeyboardVisible(true);
          document.body.classList.add('keyboard-visible');
        };

        const hideKeyboardHandler = () => {
          setIsKeyboardVisible(false);
          document.body.classList.remove('keyboard-visible');
        };

        try {
          await Keyboard.addListener('keyboardWillShow', showKeyboardHandler);
          await Keyboard.addListener('keyboardWillHide', hideKeyboardHandler);
        } catch (error) {
          console.warn('Keyboard plugin not available:', error);
        }

        // Cleanup function
        return () => {
          Keyboard.removeAllListeners();
        };
      }

      // For web platform, you might want to use a different approach
      // For example, listening to input focus events
      if (isPlatform('desktop') || isPlatform('mobileweb')) {
        const handleFocus = (e: FocusEvent) => {
          if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            setIsKeyboardVisible(true);
            document.body.classList.add('keyboard-visible');
          }
        };

        const handleBlur = (e: FocusEvent) => {
          if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
            setIsKeyboardVisible(false);
            document.body.classList.remove('keyboard-visible');
          }
        };

        document.addEventListener('focusin', handleFocus);
        document.addEventListener('focusout', handleBlur);

        return () => {
          document.removeEventListener('focusin', handleFocus);
          document.removeEventListener('focusout', handleBlur);
        };
      }
    };

    setupKeyboardListeners();
  }, []);

  const tabButtonStyle = (tabName: string) => ({
    color: activeTab === tabName ? 'black' : '#A2A2A2',
  });



  return (
    <EmotionProvider>

      <IonApp>
        <TimeSpent />
        <IonReactRouter >
          <div className='container-relative'>
            {/* <div className='testcamera' style={{height: '50px', backgroundColor: 'red', zIndex: 10000, position: 'relative'}}>
              iphone camera
            </div> */}
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/tab1">
                  <Tab1 />
                </Route>
                <Route exact path="/calendar">
                  <Calendar />
                </Route>
                <Route exact path="/onboarding">
                  <OnBoarding setActiveTab={setActiveTab} />
                </Route>
                <Route exact path="/params">
                  <Params />
                </Route>

                <Route path="/params/confidentialite">
                  <Confidentialite />
                </Route>
                <Route path="/params/utilisation">
                  <Utilisation />
                </Route>
                <Route path="/params/permission">
                  <Permission />
                </Route>

                <Route path="/restoredata">
                  <Restoredata />
                </Route>
                <Route path="/erasedata">
                  <Erasedata />
                </Route>

                <Route path="/select">
                  <Select />
                </Route>

                <Route path="/goalschoice">
                  <GoalsChoice />
                </Route>
                <Route path="/goals">
                  <Goals />
                </Route>
                <Route path="/describe">
                  <Describe />
                </Route>
                <Route path="/emotiondetail">
                  <EmotionDetail />
                </Route>
                <Route path="/selectplace">
                  <SelectPlace />
                </Route>
                <Route exact path="/">
                  <Redirect to="/onboarding" />
                </Route>
                <Route path="/stats">
                  <Stats />
                </Route>
              </IonRouterOutlet>
              <IonTabBar slot="bottom" className={isKeyboardVisible ? 'hidden' : ''}>
                <IonTabButton
                  tab="tab1"
                  href="/tab1"
                  style={tabButtonStyle('tab1')}
                  onClick={() => setActiveTab('tab1')}
                  className="tab-button" // Add a class for styling
                >
                  <IonIcon aria-hidden="true" icon={locationOutline} />
                </IonTabButton>
                <IonTabButton
                  tab="calendar"
                  href="/calendar"
                  style={tabButtonStyle('calendar')}
                  onClick={() => setActiveTab('calendar')}
                  className="tab-button" // Add a class for styling
                >
                  <IonIcon aria-hidden="true" icon={calendarOutline} />
                </IonTabButton>
                <IonTabButton
                  tab="select"
                  href="/select"
                  style={tabButtonStyle('select')}
                  onClick={() => setActiveTab('select')}
                  className="tab-button" // Add a class for styling
                >
                  <IonIcon
                    aria-hidden="true"
                    icon={addCircle}
                    style={{
                      fontSize: '36px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50px',
                      padding: '1px', // optionnel : pour que l'icône ne touche pas les bords  // pour que l'icône reste visible sur fond noir
                    }}
                    className="tab-button"
                  />

                </IonTabButton>
                <IonTabButton
                  tab="stats"
                  href="/stats"
                  style={tabButtonStyle('stats')}
                  onClick={() => setActiveTab('stats')}
                  className="tab-button" // Add a class for styling
                >
                  <IonIcon aria-hidden="true" icon={analytics} />
                </IonTabButton>
                <IonTabButton
                  tab="params"
                  href="/params"
                  style={tabButtonStyle('params')}
                  onClick={() => setActiveTab('params')}
                  className="tab-button" // Add a class for styling
                >
                  <IonIcon aria-hidden="true" icon={settingsOutline} />
                </IonTabButton>

                {/* <IonTabButton disabled>
                </IonTabButton>
                <IonTabButton disabled>
                </IonTabButton> */}
              </IonTabBar>
            </IonTabs>
          </div>

          {/* <IonRouterLink routerLink="/select" onClick={() => setActiveTab('select')} className={`tab3-button ${isKeyboardVisible ? 'hidden' : ''}`}>
            <IonFabButton
              className={`tab3-button-inside ${isKeyboardVisible ? 'hidden' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <img src="/feellogo.svg" className="logo-button" alt="Logo" />
            </IonFabButton>
          </IonRouterLink> */}
        </IonReactRouter>
      </IonApp>
    </EmotionProvider>
  );
};

export default App;