import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Formulario Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div className='form-container'>
          <IonInput
            label="Nombre del Repositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="Nuevo Repositorio"
            className='form-field'></IonInput>

          <IonTextarea
            label="Descripción del Respositorio"
            labelPlacement="floating"
            fill="outline"
            placeholder="Este es un Repositorio de ejemplo"
            rows={6}
            className='form-field'></IonTextarea>

          <IonButton expand="block"className='form-field'>Guardar</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
