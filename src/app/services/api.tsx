const API_BASE_URL = "https://evidencia-front-end-reactjs.onrender.com/api/v1";

/**
 * Un objeto que contiene las rutas de la API para varios endpoints.
 *
 * @constant
 * @type {Object}
 * @property {string} GENEROS - La ruta de la API para géneros.
 * @property {string} DIRECTORES - La ruta de la API para directores.
 * @property {string} PRODUCTORAS - La ruta de la API para productoras.
 * @property {string} TIPOS - La ruta de la API para tipos.
 * @property {string} MEDIAS - La ruta de la API para medios.
 */
const API_ROUTES = {
  GENEROS: `${API_BASE_URL}/generos`,
  DIRECTORES: `${API_BASE_URL}/directores`,
  PRODUCTORAS: `${API_BASE_URL}/productoras`,
  TIPOS: `${API_BASE_URL}/tipos`,
  MEDIAS: `${API_BASE_URL}/medias`,
};

export default API_ROUTES;
