import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import RepoItem from '../components/RepoItem';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <RepoItem name='android-repo' imageUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-WfZcJTcJ9dxzEXp02aEkGhnHNK8OjqTZ0g&s'/>
          <RepoItem name='ios-repo' imageUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEDGcD3eM-a1ypRE2_IobXQnadQ4DACw3CrQ&s'/>
          <RepoItem name='ionic-repo' imageUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNYnQXVfoegwoeFt9wJO05m51WML8DdyCQIQ&s'/>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
