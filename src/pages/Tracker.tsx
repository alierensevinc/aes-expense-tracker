import {
    IonAccordion,
    IonAccordionGroup,
    IonButton,
    IonButtons,
    IonChip,
    IonContent,
    IonDatetime,
    IonDatetimeButton,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonMenuButton,
    IonModal,
    IonPage,
    IonSegment,
    IonSegmentButton,
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
import {addOutline, arrowDownOutline, checkmarkDone, closeOutline, trashOutline} from "ionicons/icons";
import {useForm} from "react-hook-form";

const Tracker: React.FC = () => {
    const modal = useRef<HTMLIonModalElement>(null);
    const {
        getTransactions,
        addTransaction,
        getGroupedTransactions,
        deleteTransaction,
        getIconForCategory,
        getCategories
    } = useCashTracker();
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
    const [groupedTransactions, setGroupedTransactions] = useState<{ category: string; transactions: Transaction[] }[]>();
    const [view, setView] = useState('all');

    useEffect(() => {
        loadTransactions();
    }, []);

    useEffect(() => {
        loadGroupedTransactions();
    }, [transactions]);

    const loadTransactions = async () => {
        const data = await getTransactions();
        setTransactions(data);
    }

    const loadGroupedTransactions = async () => {
        const data = await getGroupedTransactions();
        console.log(data);
        setGroupedTransactions(data);
    }

    const onDateSelected = (ev: any) => {
        setValue('createdAt', new Date(ev).getTime());
    }

    const shouldAddTransaction = async (data: any) => {
        data.value = +data.value;
        data.id = new Date().getTime();
        await addTransaction(data);
        setTransactions([data, ...transactions]);
        modal.current?.dismiss();
    }

    const shouldDeleteTransaction = async (transaction: Transaction) => {
        const filtered = await deleteTransaction(transaction);
        setTransactions(filtered);
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
                <IonToolbar>
                    <IonSegment value={view} onIonChange={(ev) => setView(ev.detail.value! + "")}>
                        <IonSegmentButton value={'all'}>All</IonSegmentButton>
                        <IonSegmentButton value={'category'}>Category</IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {
                    view === 'all' && <IonList>
                        {transactions.map((trans) => (
                            <IonItemSliding key={trans.id}>
                                <IonItem detail={false} routerLink={`/tracker/${trans.id}`}>
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

                                <IonItemOptions slot={'end'}>
                                    <IonItemOption onClick={() => shouldDeleteTransaction(trans)}>
                                        <IonIcon icon={trashOutline} slot={'icon-only'}/>
                                    </IonItemOption>
                                </IonItemOptions>
                            </IonItemSliding>
                        ))}
                    </IonList>
                }
                {
                    view === 'category' && <IonAccordionGroup multiple={true}>
                        {groupedTransactions?.map((group) => (
                            <IonAccordion key={group.category} toggleIcon={arrowDownOutline}>
                                <IonItem lines="none" slot="header">
                                    <IonIcon
                                        color={'secondary'}
                                        slot="start"
                                        icon={getIconForCategory(group.category)}
                                    />
                                    <IonLabel>
                                        {group.category}
                                        <IonChip color={'secondary'}>{group.transactions.length}</IonChip>
                                    </IonLabel>
                                </IonItem>
                                <IonList slot="content">
                                    {group.transactions.map((trans) => (
                                        <IonItem lines="none" key={trans.id} className="transaction-items">
                                            <IonLabel>
                                                <NumericFormat
                                                    value={trans.value}
                                                    displayType={'text'}
                                                    thousandSeparator={true}
                                                    prefix={'$'}
                                                />
                                                <p>{trans.title}</p>
                                            </IonLabel>
                                            <p slot="end">{new Intl.DateTimeFormat('en-GB').format(trans.createdAt)}</p>
                                        </IonItem>
                                    ))}
                                </IonList>
                            </IonAccordion>
                        ))}
                    </IonAccordionGroup>
                }
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
                        <form id={'custom-form'} onSubmit={handleSubmit(shouldAddTransaction)}>
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