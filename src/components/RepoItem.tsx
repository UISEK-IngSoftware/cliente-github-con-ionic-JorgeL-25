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
  onChanged: () => void; // recarga lista (fallback)
  onDeleted?: (fullName: string) => void; 
};

const RepoItem: React.FC<Props> = ({ repo, onChanged, onDeleted }) => {
  const slidingRef = useRef<HTMLIonItemSlidingElement>(null);

  const [loading, setLoading] = useState(false);
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

  const saveEdit = async () => {
    if (!canAct) {
      setToast("No se puede editar: owner inválido.");
      return;
    }
    if (!editName.trim()) {
      setToast("El nombre no puede estar vacío.");
      return;
    }

    try {
      setLoading(true);

      await updateRepository(repo.owner!, repo.name, {
        // si tu profe no quiere renombrar, comenta esta línea:
        name: editName.trim(),
        description: editDesc.trim(),
        private: editPrivate,
      });

      setIsEditOpen(false);
      setToast("Repositorio actualizado ✅");

      // refresca para que se vea el cambio (nombre/desc/privado)
      onChanged();
    } catch (e: any) {
      setToast(e?.message || "Error actualizando repo");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!canAct) {
      setToast("No se puede eliminar: owner inválido.");
      return;
    }

    try {
      setLoading(true);

      await deleteRepository(repo.owner!, repo.name);

      setToast("Repositorio eliminado ✅");

      // BORRA DE LA UI AL INSTANTE
      if (onDeleted) {
        onDeleted(fullName);
      } else {
        // fallback: recargar lista si no te pasan onDeleted
        onChanged();
      }
    } catch (e: any) {
      setToast(e?.message || "Error eliminando repo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IonLoading isOpen={loading} message="Procesando..." />

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
              // no uses await aquí (handler de Ionic)
              confirmDelete();
            },
          },
        ]}
        onDidDismiss={() => setIsDeleteOpen(false)}
      />

      {/* MODAL DE EDITAR */}
      <IonModal
        isOpen={isEditOpen}
        onDidDismiss={() => setIsEditOpen(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Editar Repo</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsEditOpen(false)}>Cerrar</IonButton>
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

          <IonButton expand="block" onClick={saveEdit} disabled={!canAct}>
            Guardar tus cambios
          </IonButton>

          <IonButton
            expand="block"
            color="medium"
            onClick={() => setIsEditOpen(false)}
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

        {/* BOTONES (icono + texto) */}
        <IonItemOptions side="end">
          <IonItemOption color="warning" onClick={openEdit} disabled={!canAct}>
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
            disabled={!canAct}
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
