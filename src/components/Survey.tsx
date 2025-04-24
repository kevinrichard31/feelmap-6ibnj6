import React, { useState, useRef } from "react";
import {
    IonModal,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonButtons,
    IonItem,
    IonLabel,
    IonTextarea,
    IonToast
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useSurveyStore } from "../store/surveyStore";
import { submitSurvey } from "../utils/api";
import { useTranslation } from "react-i18next";

const Survey: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLIonModalElement>(null);
    const { hasSubmittedSurvey, setHasSubmittedSurvey } = useSurveyStore();
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const { t } = useTranslation();
    const [rating, setRating] = useState<number | undefined>(undefined);
    const [comment, setComment] = useState<string>("");

    const userId = localStorage.getItem("userId") || "";
    const commentRef = useRef<HTMLIonTextareaElement>(null);
    const MAX_CHARS = 500;
    const [charCount, setCharCount] = useState(0);

    const handleTextChange = (event: CustomEvent) => {
        const text = (event.detail.value || "") as string;
        let newText = text;

        if (text.length > MAX_CHARS) {
            newText = text.slice(0, MAX_CHARS);
        }

        setCharCount(newText.length);

        if (commentRef.current) {
            commentRef.current.value = newText;
        }
    };

    const handleSubmit = async () => {
        if (!rating) {
            alert(t("Please provide a rating before submitting."));
            return;
        }

        const commentValue = commentRef.current?.value?.trim() || undefined;

        const surveyData = {
            question1: rating,
            question2: commentValue,
        };

        try {
            const result = await submitSurvey(surveyData, userId);
            console.log(t("Server response after submit:"), result);

            setIsOpen(false);
            setToastMessage(t("Thank you for your feedback!"));
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            const errorMessage =
                error instanceof Error ? error.message : "Erreur inconnue.";
            alert(t("Error: {{error}}", { error: errorMessage }));
        }
    };

    return (
        <>
            {!hasSubmittedSurvey && (
                <div className="sticky-survey-button" onClick={() => setIsOpen(true)}>
                    {t("Your ideas")}
                </div>
            )}

            <IonModal isOpen={isOpen} ref={modalRef} onDidDismiss={() => setIsOpen(false)} style={{ paddingTop: '100px' }}>
                <IonHeader>
                    <IonToolbar className="toolbar-survey">
                        <div style={{ paddingLeft: '15px' }}>{t("Your ideas")}</div>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsOpen(false)}>
                                <IonIcon icon={closeOutline} className="close-icon" />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="ion-padding">
                    <IonItem lines="none" className="item-survey">
                        <IonLabel position="stacked" className="reviewSize">{t("Rate the app")}</IonLabel>
                        <div className="rating-buttons">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <IonButton
                                    key={val}
                                    fill={rating === val ? "solid" : "outline"}
                                    size="small"
                                    onClick={() => setRating(val)}
                                    className="rating-button"
                                >
                                    {val}
                                </IonButton>
                            ))}
                        </div>
                    </IonItem>

                    <IonItem className="item-survey">
                        <IonLabel position="stacked" className="reviewSize" style={{ marginTop: '20px' }}>{t("Any suggestions?")}</IonLabel>
                        <IonTextarea
                            ref={commentRef}
                            rows={4}
                            placeholder={t("Your suggestion...")}
                            onIonChange={handleTextChange}
                        />
                    </IonItem>

                    <IonButton expand="block" onClick={handleSubmit} className="ion-margin-top">
                        {t("Submit")}
                    </IonButton>
                </IonContent>
            </IonModal>

            <IonToast
                isOpen={!!toastMessage}
                message={toastMessage || ""}
                onDidDismiss={() => setToastMessage(null)}
                duration={3000}
                position="top"
            />

            <style>{`
                .close-icon {
                    --color: black;
                }

                @media (prefers-color-scheme: dark) {
                    .toolbar-survey {
                        --background: #222222;
                    }

                    .close-icon {
                        color: #fff;
                        --color: #fff;
                    }

                    .item-survey {
                        --background: none;
                        --color: white;
                    }

                    .rating-button {
                        --border-color: #ffffff!important;
                        --color: #ffffff!important;
                        --background-focused: grey;
                        --border-radius: 20px;
                    }

                    .rating-button.button-solid {
                        --background: white!important;
                        --color: black!important;
                        --background-activated: grey;
                        --background-focused: grey;
                    }
                }

                .reviewSize {
                    font-size: 22px!important;
                    font-weight: 500;
                }

                .ion-margin-top {
                    --border-radius: 100px;
                    --background: black;
                    --color: white;
                }

                .sticky-survey-button {
                    position: fixed;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%) rotate(-90deg);
                    transform-origin: right center;
                    z-index: 1000;
                    background-color: #272727;
                    color: white;
                    border-radius: 6px 6px 0 0;
                    padding: 3px 10px;
                    font-weight: 400;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    cursor: pointer;
                }

                .rating-buttons {
                    display: flex;
                    gap: 8px;
                    margin-top: 8px;
                }

                .rating-button {
                    min-width: 20px;
                    min-height: 20px;
                    --border-color: black;
                    --color: black;
                    --background-activated: grey;
                    --background-focused: grey;
                    --border-radius: 20px;
                }

                .rating-button.button-solid {
                    --background: black;
                    --color: white;
                    --background-activated: grey;
                    --background-focused: grey;
                }
            `}</style>
        </>
    );
};

export default Survey;
