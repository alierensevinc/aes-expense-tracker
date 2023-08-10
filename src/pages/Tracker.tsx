import {
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonDatetimeButton,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonModal,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import React, {useEffect, useRef, useState} from 'react';
import {Transaction, useCashTracker} from "../hooks/useCashTracker";
import {NumericFormat} from "react-number-format";
import {addOutline, checkmarkDone, closeOutline} from "ionicons/icons";
import {useForm} from "react-hook-form";

const Tracker: React.FC = () => {
    const modal = useRef<HTMLIonModalElement>(null);
    const {getTransactions, addTransaction, getIconForCategory, getCategories} = useCashTracker();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const {register, handleSubmit, setValue} = useForm({
        defaultValues: {
            title: 'Basketball',
            value: 1,
            category: 'Sports',
            notes: 'Nil Satis Nisi Optimum',
            createdAt: new Date().getTime()
        }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const data = await getTransactions();
        setTransactions(data);
    }

    const onDateSelected = (ev: any) => {
        setValue('createdAt', new Date(ev).getTime());
    }

    const saveTransaction = async (data: any) => {
        data.value = +data.value;
        data.id = new Date().getTime();
        await addTransaction(data);
        setTransactions([data, ...transactions]);
        modal.current?.dismiss();
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
                        <IonItem key={trans.id} detail={false} routerLink={`/tracker/${trans.id}`}>
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

                <IonFab slot={'fixed'} vertical={'bottom'} horizontal={'end'}>
                    <IonFabButton id={'open-expense-modal'}>
                        <IonIcon icon={addOutline}/>
                    </IonFabButton>
                </IonFab>

                <IonModal handle={false} ref={modal} trigger={'open-expense-modal'}
                          breakpoints={[0, 0.4, 0.6, 0.9]} initialBreakpoint={0.6}>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot={'start'}>
                                <IonButton onClick={() => modal.current?.dismiss()}>
                                    <IonIcon icon={closeOutline} slot={'icon-only'}/>
                                </IonButton>
                            </IonButtons>
                            <IonTitle>
                                New Transaction
                            </IonTitle>
                            <IonButtons slot={'end'}>
                                <IonButton strong={true} type={'submit'} form={'custom-form'}>
                                    <IonIcon icon={checkmarkDone} slot={'start'}/>
                                    Add
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <form id={'custom-form'} onSubmit={handleSubmit(saveTransaction)}>
                            <IonItem>
                                <IonLabel position={'stacked'}>Amount</IonLabel>
                                <IonInput type={'number'}
                                          inputmode={'numeric'}
                                          {...register('value', {required: true})}/>
                            </IonItem>
                            <IonItem>
                                <IonLabel position={'stacked'}>Title</IonLabel>
                                <IonInput type={'text'}
                                          {...register('title', {required: true})}/>
                            </IonItem>
                            <IonItem>
                                <IonLabel position={'fixed'}>Date</IonLabel>
                                <IonDatetimeButton slot={'end'} datetime={'datetime'}/>
                            </IonItem>
                            <IonModal keepContentsMounted={true}>
                                <IonDatetime showDefaultButtons={true} presentation={'date'} id={'datetime'}
                                             onIonChange={ev => onDateSelected(ev.detail.value)}/>
                            </IonModal>
                            <IonItem>
                                <IonLabel>Category</IonLabel>
                                <IonSelect placeholder={'Category'}
                                           {...register('category', {required: true})}>
                                    {
                                        getCategories().map(cat => (
                                            <IonSelectOption key={cat.name} value={cat.name}>
                                                {cat.name}
                                            </IonSelectOption>
                                        ))
                                    }
                                </IonSelect>
                            </IonItem>
                            <IonItem lines={'none'}>
                                <IonLabel position={'stacked'}>Notes</IonLabel>
                                <IonTextarea rows={4} placeholder={'Custom Notes'}
                                             {...register('notes', {required: true})} />
                            </IonItem>
                        </form>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    )
}

export default Tracker;