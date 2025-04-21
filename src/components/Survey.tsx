// Survey.tsx
import React, { useState, useRef } from "react";
import * as SurveyCore from "survey-core";
import { Survey as SurveyComponent } from "survey-react-ui";
import {
    IonModal,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonButtons,
    // Optionnel: Pour un meilleur feedback utilisateur
    IonToast
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import "survey-core/survey-core.css";
import { useSurveyStore } from "../store/surveyStore";
import { submitSurvey } from "../utils/api"; // 👈 Importe la fonction API

const surveyJson = {
    "locale": "fr",
    "pages": [
        {
            "elements": [
                {
                    "type": "rating",
                    "name": "question1", // Correspond à rating / SurveyData.question1
                    "title": "Donnez une note à l'application ?"
                },
                {
                    "type": "comment",
                    "name": "question2", // Correspond à comment / SurveyData.question2
                    "title": "Une idée d'amélioration ?"
                }
            ]
        }
    ],
    "headerView": "advanced"
};

const Survey: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLIonModalElement>(null);
    const { hasSubmittedSurvey, setHasSubmittedSurvey } = useSurveyStore();
    // Optionnel: état pour gérer les messages (succès/erreur)
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Crée une instance du modèle de sondage
    const survey = new SurveyCore.Model(surveyJson);
    const userId = localStorage.getItem('userId') || '';
    // Gère l'événement de complétion du sondage
    survey.onComplete.add(async (sender) => { // 👈 Rendre la fonction async
        console.log("Résultats du sondage capturés :", sender.data);

        // Le type de sender.data doit être compatible avec l'interface SurveyData
        // définie dans api.ts ({ question1: number, question2?: string })
        // Ce qui est le cas ici car les 'name' correspondent.

        try {
            // Appelle la fonction API pour envoyer les données au backend
            const result = await submitSurvey(sender.data, userId); // 👈 Appel API avec await
            console.log("Réponse du serveur après soumission :", result);

            // Si l'envoi réussit:
            // setHasSubmittedSurvey(true);
            setIsOpen(false);           // Fermer la modale


            // Alternative avec IonToast:
            setToastMessage("Merci pour votre retour, il nous est précieux pour continuer à améliorer nos services.");

        } catch (error) {
            // Si l'envoi échoue:
            console.error("Échec de l'envoi du sondage au backend:", error);

            // Informer l'utilisateur de l'échec (simple alert ici)
            // Tente d'afficher un message plus précis si disponible
            const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';
            alert(`Erreur lors de l'envoi du sondage : ${errorMessage}. Veuillez réessayer.`);
            // Alternative avec IonToast:
            // setToastMessage(`Erreur : ${errorMessage}`);

            // Ne pas fermer la modale et ne pas marquer comme soumis
            // pour permettre à l'utilisateur de potentiellement réessayer.
        }
    });

    return (
        <>
            {/* Affiche le bouton seulement si le sondage n'a pas été soumis */}
            {!hasSubmittedSurvey && (
                <div
                    className="sticky-survey-button"
                    onClick={() => setIsOpen(true)}
                >
                    Vos idées
                </div>
            )}

            {/* Modale contenant le sondage */}
            <IonModal isOpen={isOpen} ref={modalRef} onDidDismiss={() => setIsOpen(false)}> {/* Ferme aussi si on clique hors de la modale */}
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Sondage</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsOpen(false)}>
                                <IonIcon icon={closeOutline} />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="ion-padding">
                    {/* Composant qui affiche le sondage */}
                    <SurveyComponent model={survey} />
                </IonContent>
            </IonModal>

            {/* Optionnel: Composant IonToast pour afficher les messages */}
            <IonToast
                isOpen={!!toastMessage}
                message={toastMessage || ''}
                onDidDismiss={() => setToastMessage(null)}
                duration={3000} // Durée en millisecondes
                position="top" // Ou 'bottom', 'middle'
            />

            <style>
            {`
            .sticky-survey-button {
                position: fixed;
                right: 0;
                top: 50%;
                /* Correction: right: 12px; était dupliqué */
                right: 12px;
                font-size: 14px;
                transform: translateY(-50%) rotate(-90deg);
                transform-origin: right center;
                z-index: 1000;
                background-color: #272727;
                color: white;
                border-radius: 6px 6px 0 0;
                padding: 3px 10px;
                font-weight: 400;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                cursor: pointer; /* Ajout pour indiquer que c'est cliquable */
            }
            `}
            </style>
        </>
    );
};

export default Survey;