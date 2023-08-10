import React, {useState} from 'react';
import {
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter
} from '@ionic/react';
import {Transaction, useCashTracker} from "../hooks/useCashTracker";
import {NumericFormat} from "react-number-format";

const Details: React.FC<any> = ({match}) => {
    const {getTransactionById} = useCashTracker();
    const [transaction, setTransaction] = useState<Transaction>();

    useIonViewWillEnter(async () => {
        const id = match.params.id;
        const data = await getTransactionById(+id);
        setTransaction(data);
    })

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonBackButton defaultHref='/tracker'/>
                    </IonButtons>
                    <IonTitle>Details</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>
                            <IonText>
                                <NumericFormat value={transaction?.value} prefix={'$'} displayType={'text'}
                                               thousandSeparator={true}/>
                            </IonText>
                        </IonCardTitle>
                        <IonCardSubtitle>
                            {new Intl.DateTimeFormat('en-GB').format(transaction?.createdAt)}
                        </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        {transaction?.notes}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}

export default Details;
