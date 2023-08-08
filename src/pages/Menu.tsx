import {
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonMenu,
    IonMenuToggle,
    IonPage,
    IonRouterOutlet,
    IonSplitPane,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import React from 'react';
import {cashOutline, settingsOutline} from "ionicons/icons";
import Tracker from "./Tracker";
import {Redirect, Route} from "react-router-dom";
import Settings from "./Settings";

const Menu: React.FC = () => {

    const paths = [
        {name: 'Tracker', url: '/tracker', icon: cashOutline},
        {name: 'Settings', url: '/settings', icon: settingsOutline},
    ]

    return (
        <IonPage>
            <IonSplitPane contentId='main'>
                <IonMenu contentId='main'>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>
                                My Money
                            </IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        {paths.map((item, index) => (
                            <IonMenuToggle key={index} autoHide={false}>
                                <IonItem routerLink={item.url} routerDirection="none">
                                    <IonIcon icon={item.icon} slot='start'/>
                                    {item.name}
                                </IonItem>
                            </IonMenuToggle>
                        ))}
                    </IonContent>
                </IonMenu>

                <IonRouterOutlet id='main'>
                    <Route path='/tracker' component={Tracker}/>
                    <Route path='/settings' component={Settings}/>
                    <Redirect exact from="/" to="/tracker"/>
                </IonRouterOutlet>
            </IonSplitPane>
        </IonPage>
    )
}

export default Menu;