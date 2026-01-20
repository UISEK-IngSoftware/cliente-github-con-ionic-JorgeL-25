import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { addCircleOutline, codeSlashOutline, personCircleOutline } from "ionicons/icons";

import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/tab1" component={Tab1} />
        <Route exact path="/tab2" component={Tab2} />
        <Route exact path="/tab3" component={Tab3} />
        <Route exact path="/">
          <Redirect to="/tab1" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tab1">
          <IonIcon aria-hidden="true" icon={codeSlashOutline} />
          <IonLabel>Mis Repos</IonLabel>
        </IonTabButton>

        <IonTabButton tab="tab2" href="/tab2">
          <IonIcon aria-hidden="true" icon={addCircleOutline} />
          <IonLabel>Nuevo Repo</IonLabel>
        </IonTabButton>

        <IonTabButton tab="tab3" href="/tab3">
          <IonIcon aria-hidden="true" icon={personCircleOutline} />
          <IonLabel>Mi Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
