import {
  IonButton,
  IonContent,
  IonItem,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from '@ionic/react';
import { useState, useCallback, useEffect } from 'react';
import { getAggregatedScores, getUserTraits } from '../utils/api';
import './Stats.css';
import CenteredProgressBar from '../components/CenteredProgressBar';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import Survey from '../components/Survey';

type Score = number;

interface Scores {
  [key: string]: Score;
}

const initialScores: Scores = {
  health_score: 0,
  mental_score: 0,
  physical_score: 0,
  nutrition_score: 0,
  couple_love_score: 0,
  best_friends_score: 0,
  family_only_score: 0,
  workmate_score: 0,
  relaxation_score: 0,
};

interface Trait {
  id: number;
  name: string;
  translated_name: string;
  score: number;
  type: string;
}

// Define the desired order of trait types
const traitTypeOrder = [
  'health',
  'social',
  'personality',
  'interests',
  'brands_mentionned',
];

// Define the possible time ranges and their display names
const timeRangeOptions = {
  last_7_days: '7 derniers jours',
  this_month: 'Ce mois-ci',
  last_month: 'Mois dernier',
  last_3_months: '3 derniers mois',
  today: "Aujourd'hui",
  all: 'Tout',
} as const;

// Type for timeRangeOptions keys
type TimeRangeKey = keyof typeof timeRangeOptions;

const Stats: React.FC = () => {
  const [scores, setScores] = useState<Scores>(initialScores);
  const [traits, setTraits] = useState<Trait[] | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRangeKey>('last_7_days');
  const { t } = useTranslation();
  const fetchScores = useCallback(
    async (timeRange: TimeRangeKey) => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const data = await getAggregatedScores(userId, timeRange);
        if (data) {
          setScores(data);
        } else {
          setScores(initialScores);
        }
      } else {
        setScores(initialScores);
      }
    },
    [],
  );

  const fetchTraits = useCallback(async (timeRange?: TimeRangeKey) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      const data = await getUserTraits(userId, timeRange); // Pass timeRange here

      if (data && data.traits) {
        // Sort the traits array alphabetically by translated_name
        const sortedTraits = [...data.traits].sort((a, b) =>
          a.translated_name.localeCompare(b.translated_name),
        );
        setTraits(sortedTraits);
      } else {
        setTraits(null);
      }
    } else {
      setTraits(null);
    }
  }, []);

  useIonViewWillEnter(() => {
    fetchScores(selectedTimeRange);
    fetchTraits(selectedTimeRange);
  }, [selectedTimeRange, fetchScores, fetchTraits]);

  useEffect(() => {
    fetchScores(selectedTimeRange);
    fetchTraits(selectedTimeRange);
  }, [selectedTimeRange, fetchScores, fetchTraits]);

  useIonViewWillLeave(() => {
    setScores(initialScores);
  });

  const handleTimeRangeChange = (e: any) => {
    const timeRange = e.detail.value as TimeRangeKey;
    setSelectedTimeRange(timeRange);
  };

  // Function to group traits by type
  const groupTraitsByType = (traits: Trait[] | null): { [key: string]: Trait[] } => {
    if (!traits) {
      return {};
    }

    const grouped: { [key: string]: Trait[] } = {};
    traitTypeOrder.forEach((type) => {
      grouped[type] = [];
    });

    traits.forEach((trait) => {
      if (grouped[trait.type]) {
        grouped[trait.type].push(trait);
      } else {
        grouped[trait.type] = [trait]; // If the type wasn't explicitly listed, add it.  This handles cases where your API might return new trait types.
      }
    });

    return grouped;
  };

  const groupedTraits = groupTraitsByType(traits);

  return (
    <IonPage>
    <Survey />
      <IonContent fullscreen forceOverscroll={false}>
        <div className="stats-container">
          <div className='title-container-stats'>
            <h1 className="title" style={{ fontWeight: 400, marginBottom: 15 }}>
              {t('stats.title')}
            </h1>
            <IonList>
              <IonItem>
                <IonSelect
                  aria-label="Time Range"
                  interface="popover"
                  value={selectedTimeRange}
                  onIonChange={handleTimeRangeChange}
                >
                  {Object.entries(timeRangeOptions).map(([key, label]) => (
                    <IonSelectOption key={key} value={key}>
                      {t(`stats.timeRange.${key}`)}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonList>
          </div>


          {/* Santé */}
          <div className="card">
            <h1 className="title" style={{ position: 'relative' }}>
              {t('stats.me.title')} <img className="me-smile-img" src="/images/me-smile.svg" alt="" />
            </h1>
            <p className="tagline">{t('stats.me.tagline')}</p>
            <div className="subcategory-title">{t('stats.me.vitalBalance')}</div>
            <div className="container-stats-key">
              <div className="container-stats-name">{t('stats.me.physical')}</div>
              <CenteredProgressBar value={scores.physical_score} />
            </div>

            <div className="container-stats-key">
              <div className="container-stats-name">{t('stats.me.nutritional')}</div>
              <CenteredProgressBar value={scores.nutrition_score} />
            </div>

            <div className="container-stats-key">
              <div className="container-stats-name">{t('stats.me.mental')}</div>
              <CenteredProgressBar value={scores.mental_score} />
            </div>

            <hr />
            <hr />
            <div className="subcategory-title">{t('stats.me.spirit')}</div>
            <div className="container-stats-key">
              <div className="container-stats-name">{t('stats.me.relaxationScore')}</div>
              <CenteredProgressBar value={scores.relaxation_score} />
            </div>
          </div>

          {/* Cercle Social */}
          <div className="card">
            <h1 className="title" style={{ position: 'relative' }}>
              {t('stats.socialCircle.title')} <img className="me-smile-img" src="/images/entourage.svg" alt="" />
            </h1>
            <p className="tagline">{t('stats.socialCircle.tagline')}</p>
            <div className="container-stats-key">
              <div className="container-stats-name">{t('stats.socialCircle.family')}</div>
              <CenteredProgressBar value={scores.family_only_score} />
            </div>
            <div className="container-stats-key">
              <div className="container-stats-name">{t('stats.socialCircle.love')}</div>
              <CenteredProgressBar value={scores.couple_love_score} />
            </div>
            <div className="container-stats-key">
              <div className="container-stats-name">{t('stats.socialCircle.friends')}</div>
              <CenteredProgressBar value={scores.best_friends_score} />
            </div>
            <div className="container-stats-key">
              <div className="container-stats-name">{t('stats.socialCircle.colleagues')}</div>
              <CenteredProgressBar value={scores.workmate_score} />
            </div>
          </div>

          {/* Traits Section */}
          {/* Traits Section */}

          <div className="card">
            <h1 className="title">{t('stats.advancedData.title')}</h1>
            <p className="tagline">{t('stats.advancedData.tagline')}</p>
            {['health', 'personality', 'interests'].map((type) => (
              <div className="--group" key={type}>
                <div className="subcategory-title">
                  {t(`stats.traitTypes.${type}`)}
                </div>
                {groupedTraits[type] && groupedTraits[type].length > 0 ? (
                  [...groupedTraits[type]] // Create a copy to avoid modifying the original
                    .sort((a, b) => b.score - a.score) // Sort by score descending
                    .filter((trait) => trait.score !== 0)
                    .map((trait) => (
                      <div key={trait.id} className="container-stats-key">
                        <div className="container-stats-name">{trait.translated_name}</div>
                        <CenteredProgressBar value={trait.score} />
                      </div>
                    ))
                ) : (
                  <p>{t('stats.noTraitsFound')}</p>
                )}
              </div>
            ))}
          </div>

          <div style={{ height: '300px', color: 'grey', fontSize: '12px' }}>
          {t('stats.disclaimer')}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Stats;