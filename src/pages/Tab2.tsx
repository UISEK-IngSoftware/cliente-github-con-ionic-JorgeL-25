import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { createRepository } from "../services/GithubService";
import "./Tab2.css";

const Tab2: React.FC = () => {
  const router = useIonRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = () => {
    const clean = name.trim();
    if (!clean) return "El nombre del repositorio es obligatorio.";
    if (clean.length < 3) return "El nombre debe tener al menos 3 caracteres.";
    if (/\s/.test(clean)) return "No uses espacios (usa guiones).";
    return "";
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");
      setToastMsg("");

      await createRepository({
        name: name.trim(),
        description: description.trim() || undefined,
        private: false, // si tu lab no pide private, déjalo false
      });

      setToastMsg("Repositorio creado correctamente");

      // limpiar formulario
      setName("");
      setDescription("");

      // volver a Tab1 (Repositorios)
      // (la lista se recarga al entrar por useIonViewDidEnter)
      setTimeout(() => router.push("/tab1", "root"), 800);
    } catch (e: any) {
      setErrorMsg(e.message || "Error creando repositorio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Formulario Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonLoading isOpen={loading} message="Creando repositorio..." />

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={2000}
          onDidDismiss={() => setToastMsg("")}
        />

        <IonToast
          isOpen={!!errorMsg}
          message={errorMsg}
          duration={3000}
          onDidDismiss={() => setErrorMsg("")}
        />

        <div className="form-container">
          <IonInput
            className="form-field"
            label="Nombre del repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="android-project"
            value={name}
            onIonInput={(e) => setName(e.detail.value || "")}
          />

          <IonTextarea
            className="form-field"
            label="Descripción del repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="Descripción del repositorio"
            value={description}
            onIonInput={(e) => setDescription(e.detail.value || "")}
            rows={6}
          />

          <IonButton expand="block" className="form-field" onClick={handleSave}>
            Guardar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;

