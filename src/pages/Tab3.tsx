import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonLoading,
  IonToast,
  useIonViewDidEnter,
} from "@ionic/react";
import { getUserInfo } from "../services/GithubService";
import { UserInfo } from "../interfaces/UserInfo";
import "./Tab3.css";

const Tab3: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // State UI (similar al video, pero tipado)
  const [userInfo, setUserInfo] = useState({
    name: "No se puede cargar el usuario",
    username: "no-username",
    bio: "No se puede cargar la biografía",
    avatar_url: "https://ionicframework.com/docs/img/demos/card-media.png",
  });

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const response: UserInfo = await getUserInfo();

      setUserInfo({
        name: response.name || "Sin nombre",
        username: response.login,
        bio: response.bio || "Sin bio",
        avatar_url: response.avatar_url,
      });
    } catch (e: any) {
      setErrorMsg(e.message || "Error cargando usuario");
    } finally {
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
          <IonTitle>Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonLoading isOpen={loading} message="Cargando usuario..." />
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
            <IonCardSubtitle>{userInfo.username}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>{userInfo.bio}</IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
