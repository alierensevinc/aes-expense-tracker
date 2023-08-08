import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import React, {useEffect, useState} from 'react';
import {Transaction, useCashTracker} from "../hooks/useCashTracker";
import {NumericFormat} from "react-number-format";

const Tracker: React.FC = () => {
    const {getTransactions, getIconForCategory} = useCashTracker();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getTransactions();
        setTransactions(data);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle>Tracker</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonList>
                    {transactions.map((trans) => (
                        <IonItem key={trans.id}>
                            <IonIcon slot={'start'} icon={getIconForCategory(trans.category)}/>
                            <IonLabel>
                                <h2>{trans.title}</h2>
                                <p>{new Intl.DateTimeFormat('en-GB').format(trans.createdAt)}</p>
                            </IonLabel>
                            <IonText slot='end'>
                                <NumericFormat value={trans.value} prefix={'$'} displayType={'text'}
                                               thousandSeparator={true}/>
                            </IonText>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    )
}

export default Tracker;