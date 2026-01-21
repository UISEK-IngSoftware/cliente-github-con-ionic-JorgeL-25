import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";
import { getAuth } from "../auth";

const GITHUB_API_URL =
  import.meta.env.VITE_GITHUB_API_URL || "https://api.github.com";

/**
 * Headers con token desde Ionic Storage (getAuth)
 */
const authHeaders = async () => {
  const auth = await getAuth();

  if (!auth?.token) {
    throw new Error("No hay sesión. Inicia sesión nuevamente.");
  }

  return {
    Authorization: `Bearer ${auth.token}`,
    Accept: "application/vnd.github+json",
  };
};

/**
 * Helper para mensajes bonitos según status
 */
const handleAxiosError = (error: any, defaultMsg: string) => {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  // errores comunes GitHub
  if (status === 401) {
    throw new Error("Token inválido o expirado. Vuelve a iniciar sesión.");
  }

  if (status === 403) {
    // GitHub suele mandar este texto cuando el token no tiene permiso al repo
    if (
      String(message || "")
        .toLowerCase()
        .includes("resource not accessible by personal access token")
    ) {
      throw new Error(
        "El token NO tiene acceso a este repositorio. Crea un token con acceso a 'All repositories' o selecciona este repo."
      );
    }

    throw new Error(
      message ||
        "Acceso denegado (403). Revisa permisos del token (Administration RW / Contents RW)."
    );
  }

  if (status === 404) {
    throw new Error(
      "Repositorio no encontrado (404). Tal vez no existe o el token no tiene acceso."
    );
  }

  if (status === 422) {
    throw new Error(
      message ||
        "Error (422): datos inválidos (nombre repetido, caracteres inválidos, etc.)."
    );
  }

  throw new Error(message || defaultMsg);
};

/**
 * GET /user/repos
 */
export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
  const headers = await authHeaders();

  try {
    const response = await axios.get(`${GITHUB_API_URL}/user/repos`, {
      headers,
      params: {
        per_page: 100,
        sort: "created",
        direction: "desc",
        affiliation: "owner",
      },
    });

    return response.data.map((repo: any) => ({
      name: repo.name,
      fullName: repo.full_name, 
      description: repo.description || null,
      imageUrl: repo.owner?.avatar_url || null,
      owner: repo.owner?.login || null,
      language: repo.language || null,
      private: !!repo.private,
    })) as RepositoryItem[];
  } catch (error: any) {
    handleAxiosError(error, "Error obteniendo repositorios");
    return [];
  }
};

/**
 * GET /user
 */
export const getUserInfo = async (): Promise<UserInfo> => {
  const headers = await authHeaders();

  try {
    const response = await axios.get(`${GITHUB_API_URL}/user`, { headers });
    return response.data as UserInfo;
  } catch (error: any) {
    handleAxiosError(error, "Error obteniendo usuario");
    throw error;
  }
};

/**
 * POST /user/repos
 */
export const createRepository = async (payload: {
  name: string;
  description?: string;
  private?: boolean;
}) => {
  const headers = await authHeaders();

  try {
    const response = await axios.post(`${GITHUB_API_URL}/user/repos`, payload, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    handleAxiosError(error, "Error creando repositorio");
    throw error;
  }
};

/**
 * PATCH /repos/{owner}/{repo}
 */
export const updateRepository = async (
  owner: string,
  repoName: string,
  payload: {
    name?: string;
    description?: string;
    private?: boolean;
  }
) => {
  const headers = await authHeaders();

  try {
    const response = await axios.patch(
      `${GITHUB_API_URL}/repos/${owner}/${repoName}`,
      payload,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    handleAxiosError(error, "Error actualizando repositorio");
    throw error;
  }
};

/**
 * DELETE /repos/{owner}/{repo}
 */
export const deleteRepository = async (owner: string, repoName: string) => {
  const headers = await authHeaders();

  try {
    await axios.delete(`${GITHUB_API_URL}/repos/${owner}/${repoName}`, {
      headers,
    });
    return true;
  } catch (error: any) {
    handleAxiosError(error, "Error eliminando repositorio");
    throw error;
  }
};
