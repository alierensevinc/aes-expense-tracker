import React, {useState} from 'react';
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter
} from '@ionic/react';
import {Transaction, useCashTracker} from "../hooks/useCashTracker";
import {NumericFormat} from "react-number-format";
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';
import {cameraOutline} from "ionicons/icons";


const Details: React.FC<any> = ({match}) => {
    const {getTransactionById, updateTransaction} = useCashTracker();
    const [transaction, setTransaction] = useState<Transaction>();

    useIonViewWillEnter(async () => {
        const id = match.params.id;
        const data = await getTransactionById(+id);
        setTransaction(data);
    })

    const takePicture = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: true,
            resultType: CameraResultType.Base64,
            source: CameraSource.Prompt,
        });
        const imageString = `data:image/png;base64,${image.base64String}`;
        const updated = {
            ...transaction!,
            image: imageString
        }
        setTransaction(updated);
        updateTransaction(updated);
    };

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
            <IonContent className="ion-padding" fullscreen={true}>
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
                        {
                            transaction?.image && <img src={transaction.image} alt={'Transaction image'}/>
                        }
                    </IonCardContent>
                    <IonButton expand={'block'} fill={'outline'} onClick={takePicture}>
                        <IonIcon icon={cameraOutline} slot={'start'}/>
                        Add Image
                    </IonButton>
                </IonCard>
            </IonContent>
        </IonPage>
    );
}

export default Details;
