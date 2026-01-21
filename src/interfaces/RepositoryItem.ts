export interface RepositoryItem {
  name: string;
  fullName: string;
  description: string | null;
  imageUrl: string | null;
  owner: string | null;
  language: string | null;

  //extras útiles para editar/eliminar sin adivinar cosas
  private?: boolean;
}
