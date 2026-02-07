import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonLoading,
  IonToast,
  IonButton,
  useIonViewDidEnter,
} from "@ionic/react";
import "./Tab3.css";

import { getUserInfo } from "../services/GithubService";
import { clearAuth } from "../auth";

const Tab3: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Cargando...");
  const [errorMsg, setErrorMsg] = useState("");

  const [userInfo, setUserInfo] = useState({
    name: "No se puede cargar el usuario",
    username: "no-username",
    bio: "No se puede cargar la biografía",
    avatar_url: "https://ionicframework.com/docs/img/demos/card-media.png",
  });

  //GET /user (spinner por llamada)
  const loadUserInfo = async () => {
    if (loading) return;

    try {
      setLoadingMsg("Cargando perfil...");
      setLoading(true);
      setErrorMsg("");

      const response = await getUserInfo();

      setUserInfo({
        name: response?.name ?? "Sin nombre",
        username: response?.login ?? "sin-username",
        bio: response?.bio ?? "Sin bio",
        avatar_url:
          response?.avatar_url ??
          "https://ionicframework.com/docs/img/demos/card-media.png",
      });
    } catch (e: any) {
      setErrorMsg(e?.message || "Error cargando usuario");
    } finally {
      setLoading(false);
    }
  };

  //Logout (spinner por acción)
  const logout = async () => {
    if (loading) return;

    try {
      setLoadingMsg("Cerrando sesión...");
      setLoading(true);
      setErrorMsg("");

      // 1) borrar token/usuario
      await clearAuth();

      // 2) forzar recarga completa a /login
      window.location.replace("/login");
    } catch (e: any) {
      setErrorMsg(e?.message || "Error al cerrar sesión");
      setLoading(false);
    }
  };

  useIonViewDidEnter(() => {
    loadUserInfo();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonLoading isOpen={loading} message={loadingMsg} />
        <IonToast
          isOpen={!!errorMsg}
          message={errorMsg}
          duration={3000}
          onDidDismiss={() => setErrorMsg("")}
        />

        <IonCard className="card">
          <img alt="avatar" src={userInfo.avatar_url} />

          <IonCardHeader>
            <IonCardTitle>{userInfo.name}</IonCardTitle>
            <IonCardSubtitle>@{userInfo.username}</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <p>{userInfo.bio}</p>

            <IonButton
              expand="block"
              color="danger"
              onClick={logout}
              disabled={loading}
            >
              Cierra tu sesión
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
