import React from "react";
import {
  IonContent,
  IonHeader,
  IonList,
  IonLoading,
  IonPage,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react";
import "./Tab1.css";
import RepoItem from "../components/RepoItem";
import { fetchRepositories } from "../services/GithubService";
import { RepositoryItem } from "../interfaces/RepositoryItem";

const Tab1: React.FC = () => {
  const [repos, setRepos] = React.useState<RepositoryItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const loadRepos = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const reposData = await fetchRepositories();
      setRepos(reposData);
    } catch (e: any) {
      setErrorMsg(e.message || "Error cargando repositorios");
    } finally {
      setLoading(false);
    }
  };

  useIonViewDidEnter(() => {
    console.log("****** Cargando repositorios ******");
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
        <IonLoading isOpen={loading} message="Cargando repositorios..." />
        <IonToast
          isOpen={!!errorMsg}
          message={errorMsg}
          duration={2500}
          onDidDismiss={() => setErrorMsg("")}
        />

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {repos.map((repo, index) => (
            <RepoItem key={index} repo={repo} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
