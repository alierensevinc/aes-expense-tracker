import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const Details: React.FC = () => {
        return (
           <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Details</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                UI goes here...
                </IonContent>
           </IonPage>
        );
}

export default Details;
