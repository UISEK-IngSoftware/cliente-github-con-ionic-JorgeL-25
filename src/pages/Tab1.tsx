import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonLoading,
  IonToast,
  useIonViewDidEnter,
} from "@ionic/react";
import RepoItem from "../components/RepoItem";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { fetchRepositories } from "../services/GithubService";

const Tab1: React.FC = () => {
  const [repos, setRepos] = useState<RepositoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const loadRepos = async () => {
    try {
      setLoading(true);
      setMsg("");

      const data = await fetchRepositories();
      setRepos(data);
    } catch (e: any) {
      setMsg(e.message || "Error cargando repositorios");
    } finally {
      setLoading(false);
    }
  };

  useIonViewDidEnter(() => {
    loadRepos();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonLoading isOpen={loading} message="Cargando..." />
        <IonToast
          isOpen={!!msg}
          message={msg}
          duration={2500}
          onDidDismiss={() => setMsg("")}
        />

        <IonList>
          {repos.map((r) => (
            <RepoItem key={r.name} repo={r} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
