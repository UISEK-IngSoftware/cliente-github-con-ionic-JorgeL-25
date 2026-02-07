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

  //GET /user/repos (con spinner por llamada)
  const loadRepos = async () => {
    try {
      setLoading(true);
      setMsg("");

      const data = await fetchRepositories();
      setRepos(data);
    } catch (e: any) {
      setMsg(e?.message || "Error cargando repositorios");
    } finally {
      setLoading(false);
    }
  };

  //Se ejecuta cada vez que entras a Tab1 (para tener datos actualizados)
  useIonViewDidEnter(() => {
    loadRepos();
  });

  //BORRA DE LA UI al instante cuando RepoItem confirma que se eliminó
  const handleRepoDeleted = (fullName: string) => {
    setRepos((prev) =>
      prev.filter((r: any) => {
        const rFullName = r.fullName || `${r.owner ?? ""}/${r.name}`;
        return rFullName !== fullName;
      })
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/*Spinner por llamada a la API */}
        <IonLoading isOpen={loading} message="Cargando repos..." />

        <IonToast
          isOpen={!!msg}
          message={msg}
          duration={2500}
          onDidDismiss={() => setMsg("")}
        />

        <IonList>
          {repos.map((r: any) => {
            const key = r.fullName || `${r.owner}-${r.name}`;
            return (
              <RepoItem
                key={key}
                repo={r}
                onChanged={loadRepos} // recarga lista (GET) después de editar/eliminar
                onDeleted={handleRepoDeleted} // quita de la UI al instante
              />
            );
          })}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
