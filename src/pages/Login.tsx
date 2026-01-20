import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonLoading,
  IonToast,
  useIonRouter,
} from "@ionic/react";
import "./Login.css";
import axios from "axios";
import { saveAuth } from "../auth";

const GITHUB_API_URL =
  import.meta.env.VITE_GITHUB_API_URL || "https://api.github.com";

type LoginProps = {
  onLoginSuccess: () => void | Promise<void>;
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const ionRouter = useIonRouter();

  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !token.trim()) {
      setMsg("Debes ingresar usuario y token.");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const r = await axios.get(`${GITHUB_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: "application/vnd.github+json",
        },
      });

      const loginReal = r.data?.login;
      if (
        loginReal &&
        loginReal.toLowerCase() !== username.trim().toLowerCase()
      ) {
        setMsg(`El token pertenece a "${loginReal}", no a "${username}".`);
        return;
      }

      await saveAuth(username.trim(), token.trim());
      await onLoginSuccess();

      //navegación Ionic segura
      ionRouter.push("/tab1", "root", "replace");
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "Token inválido o sin permisos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="login-page">
        <IonLoading isOpen={loading} message="Validando..." />
        <IonToast
          isOpen={!!msg}
          message={msg}
          duration={2500}
          onDidDismiss={() => setMsg("")}
        />

        <div className="login-container">
          <div className="login-title">Iniciar tu Sesión</div>

          <div className="login-logo">
            <img
              alt="GitHub"
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            />
          </div>

          <IonText className="login-subtitle">GitHub Client</IonText>

          <IonInput
            className="login-input"
            fill="outline"
            label="Usuario de GitHub"
            labelPlacement="stacked"
            value={username}
            onIonInput={(ev) => setUsername(ev.detail.value || "")}
          />

          <IonInput
            className="login-input"
            fill="outline"
            label="Token de GitHub"
            labelPlacement="stacked"
            type="password"
            value={token}
            onIonInput={(ev) => setToken(ev.detail.value || "")}
          />

          <IonButton expand="block" onClick={handleLogin}>
            INICIA TU SESIÓN
          </IonButton>

          <IonText className="login-footer">
            Ingresa tu usuario y Personal Access Token de GitHub
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
