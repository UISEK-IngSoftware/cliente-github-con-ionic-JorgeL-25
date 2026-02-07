import React, { useRef, useState } from "react";
import {
  IonItem,
  IonLabel,
  IonThumbnail,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonAlert,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonInput,
  IonTextarea,
  IonToggle,
  IonLoading,
  IonToast,
} from "@ionic/react";
import { createOutline, trashOutline } from "ionicons/icons";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { updateRepository, deleteRepository } from "../services/GithubService";
import "./RepoItem.css";

type Props = {
  repo: RepositoryItem;
  onChanged: () => void;
  onDeleted?: (fullName: string) => void;
};

const RepoItem: React.FC<Props> = ({ repo, onChanged, onDeleted }) => {
  const slidingRef = useRef<HTMLIonItemSlidingElement>(null);

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("Procesando...");
  const [toast, setToast] = useState("");

  // Edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(repo.name);
  const [editDesc, setEditDesc] = useState(repo.description || "");
  const [editPrivate, setEditPrivate] = useState(!!(repo as any).private);

  // Delete confirm
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const canAct = !!repo.owner && !!repo.name;
  const fullName = repo.fullName;

  const closeSliding = async () => {
    try {
      await slidingRef.current?.closeOpened();
    } catch {
      // ignore
    }
  };

  const openEdit = async () => {
    await closeSliding();
    setEditName(repo.name);
    setEditDesc(repo.description || "");
    setEditPrivate(!!(repo as any).private);
    setIsEditOpen(true);
  };

  //PATCH /repos/{owner}/{repo}
  const saveEdit = async () => {
    if (loading) return;

    if (!canAct) {
      setToast("No se puede editar: owner inválido.");
      return;
    }
    if (!editName.trim()) {
      setToast("El nombre no puede estar vacío.");
      return;
    }

    try {
      setLoadingMsg("Actualizando repositorio...");
      setLoading(true);

      await updateRepository(repo.owner!, repo.name, {
        // si tu profe no quiere renombrar, comenta esta línea:
        name: editName.trim(),
        description: editDesc.trim(),
        private: editPrivate,
      });

      setIsEditOpen(false);
      setToast("Repositorio actualizado");

      await closeSliding();
      onChanged();
    } catch (e: any) {
      setToast(e?.message || "Error actualizando repo");
    } finally {
      setLoading(false);
      setLoadingMsg("Procesando...");
    }
  };

  //DELETE /repos/{owner}/{repo}
  const confirmDelete = async () => {
    if (loading) return;

    if (!canAct) {
      setToast("No se puede eliminar: owner inválido.");
      return;
    }

    try {
      setLoadingMsg("Eliminando repositorio...");
      setLoading(true);

      await deleteRepository(repo.owner!, repo.name);

      setToast("Repositorio eliminado");

      await closeSliding();

      //Borra de la UI al instante
      if (onDeleted) onDeleted(fullName);
      else onChanged();
    } catch (e: any) {
      setToast(e?.message || "Error eliminando repo");
    } finally {
      setLoading(false);
      setLoadingMsg("Procesando...");
    }
  };

  return (
    <>
      <IonLoading isOpen={loading} message={loadingMsg} />

      <IonToast
        isOpen={!!toast}
        message={toast}
        duration={2500}
        onDidDismiss={() => setToast("")}
      />

      {/* ALERTA DE ELIMINAR */}
      <IonAlert
        isOpen={isDeleteOpen}
        header="Eliminar repositorio"
        message={`¿Seguro que deseas eliminar "${repo.name}"? Esta acción NO se puede deshacer.`}
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            handler: () => setIsDeleteOpen(false),
          },
          {
            text: "Eliminar",
            role: "destructive",
            handler: () => {
              setIsDeleteOpen(false);
              confirmDelete();
            },
          },
        ]}
        onDidDismiss={() => setIsDeleteOpen(false)}
      />

      {/* MODAL DE EDITAR */}
      <IonModal isOpen={isEditOpen} onDidDismiss={() => setIsEditOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Editar Repo</IonTitle>
            <IonButtons slot="end">
              <IonButton disabled={loading} onClick={() => setIsEditOpen(false)}>
                Cerrar
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonInput
            fill="outline"
            label="Nombre del repositorio"
            labelPlacement="stacked"
            value={editName}
            onIonInput={(e) => setEditName(e.detail.value || "")}
          />

          <div style={{ height: 12 }} />

          <IonTextarea
            fill="outline"
            autoGrow
            label="Descripción"
            labelPlacement="stacked"
            value={editDesc}
            onIonInput={(e) => setEditDesc(e.detail.value || "")}
          />

          <div style={{ height: 12 }} />

          <IonItem lines="none">
            <IonLabel>Privado</IonLabel>
            <IonToggle
              checked={editPrivate}
              onIonChange={(e) => setEditPrivate(e.detail.checked)}
            />
          </IonItem>

          <div style={{ height: 16 }} />

          <IonButton
            expand="block"
            onClick={saveEdit}
            disabled={!canAct || loading}
          >
            Guardar tus cambios
          </IonButton>

          <IonButton
            expand="block"
            color="medium"
            onClick={() => setIsEditOpen(false)}
            disabled={loading}
          >
            Cancelar
          </IonButton>
        </IonContent>
      </IonModal>

      {/* SLIDING ITEM */}
      <IonItemSliding ref={slidingRef}>
        <IonItem>
          <IonThumbnail slot="start">
            <img
              alt={repo.name}
              src={
                repo.imageUrl ||
                "https://ionicframework.com/docs/img/demos/thumbnail.svg"
              }
            />
          </IonThumbnail>

          <IonLabel>
            <h2>{repo.name}</h2>
            <p>{repo.description || "Sin descripción"}</p>
            <p>
              <strong>Propietario:</strong> {repo.owner || "-"}
            </p>
            <p>
              <strong>Lenguaje:</strong> {repo.language || "-"}
            </p>
          </IonLabel>
        </IonItem>

        <IonItemOptions side="end">
          <IonItemOption
            color="warning"
            onClick={openEdit}
            disabled={!canAct || loading}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IonIcon icon={createOutline} />
              <span>Editar</span>
            </div>
          </IonItemOption>

          <IonItemOption
            color="danger"
            onClick={async () => {
              await closeSliding();
              setIsDeleteOpen(true);
            }}
            disabled={!canAct || loading}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IonIcon icon={trashOutline} />
              <span>Eliminar</span>
            </div>
          </IonItemOption>
        </IonItemOptions>
      </IonItemSliding>
    </>
  );
};

export default RepoItem;
