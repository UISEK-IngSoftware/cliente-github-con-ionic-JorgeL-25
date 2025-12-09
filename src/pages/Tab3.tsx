import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import './Tab3.css';

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfil Usuario</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard>
          <img 
            alt="Usuario Jorge" 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz1mHFSD9UAf9NKkI7_buBIIOdn6AY5rxqAA&s" />
          <IonCardHeader>
            <IonCardTitle>Jorge Hinojosa</IonCardTitle>
            <IonCardSubtitle>joge.hinojosa</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            Una nueva forma de aprender es observar y aplicar en tu vida cotidiana, sin embargo puede aplicar lo que tu gustes en tu vida.
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
