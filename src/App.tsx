import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonLoading, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Tabs from "./Tabs";
import Login from "./pages/Login";
import { getAuth } from "./auth";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const checkAuth = async () => {
    setChecking(true);
    const auth = await getAuth();
    setIsAuth(!!auth?.token);
    setChecking(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (checking) {
    return (
      <IonApp>
        <IonLoading isOpen={true} message="Cargando..." />
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* HOME */}
          <Route
            exact
            path="/"
            render={() => <Redirect to={isAuth ? "/tab1" : "/login"} />}
          />

          {/* LOGIN */}
          <Route
            exact
            path="/login"
            render={() =>
              isAuth ? <Redirect to="/tab1" /> : <Login onLoginSuccess={checkAuth} />
            }
          />

          {/* TABS (PROTEGIDAS) */}
          <Route
            path="/tab1"
            render={() => (isAuth ? <Tabs /> : <Redirect to="/login" />)}
          />
          <Route
            path="/tab2"
            render={() => (isAuth ? <Tabs /> : <Redirect to="/login" />)}
          />
          <Route
            path="/tab3"
            render={() => (isAuth ? <Tabs /> : <Redirect to="/login" />)}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
