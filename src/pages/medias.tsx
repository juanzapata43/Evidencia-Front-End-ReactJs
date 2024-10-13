import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ROUTES from "../app/services/api";
import Layout from "@/app/layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/router"; // Importar useRouter

interface Media {
  _id: string;
  serial: string;
  titulo: string;
  sinopsis: string;
  productora: string;
  tipo: string;
  director: string;
  genero: string;
  imagen: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  urlPelicula: string;
  ano_estreno: Date;
}

// Interfaces para dropdowns
interface Option {
  _id: string;
  nombre: string;
}

const Medias: React.FC = () => {
  const [medias, setMedias] = useState<Media[]>([]);
  const [serial, setSerial] = useState("");
  const [titulo, setTitulo] = useState("");
  const [sinopsis, setSinopsis] = useState("");
  const [productora, setProductora] = useState("");
  const [tipo, setTipo] = useState("");
  const [director, setDirector] = useState("");
  const [genero, setGenero] = useState("");
  const [imagen, setImagen] = useState<string | null>(null);
  const [urlPelicula, setUrlPelicula] = useState("");
  const [anoEstreno, setAnoEstreno] = useState<Date | null>(new Date());
  const [editId, setEditId] = useState<string | null>(null);
  
  // Inicializar el enrutador
  const router = useRouter(); 

  // Opciones para los dropdowns
  const [productoras, setProductoras] = useState<Option[]>([]);
  const [tipos, setTipos] = useState<Option[]>([]);
  const [directores, setDirectores] = useState<Option[]>([]);
  const [generos, setGeneros] = useState<Option[]>([]);

  useEffect(() => {
    fetchMedias();
    fetchDropdownData();
  }, []);

  // Fetch de las medias
  const fetchMedias = async () => {
    try {
      const response = await axios.get<Media[]>(API_ROUTES.MEDIAS);
      const mediasData = response.data.map((media) => ({
        ...media,
        ano_estreno: new Date(media.ano_estreno),
      }));
      setMedias(mediasData);
    } catch (error) {
      console.error("Error fetching medias:", error);
    }
  };

  // Fetch de datos para los dropdowns
  const fetchDropdownData = async () => {
    try {
      const [productorasRes, tiposRes, directoresRes, generosRes] =
        await Promise.all([
          axios.get(API_ROUTES.PRODUCTORAS),
          axios.get(API_ROUTES.TIPOS),
          axios.get(API_ROUTES.DIRECTORES),
          axios.get(API_ROUTES.GENEROS),
        ]);

      setProductoras(productorasRes.data as Option[]);
      setTipos(tiposRes.data as Option[]);
      setDirectores(directoresRes.data as Option[]);
      setGeneros(generosRes.data as Option[]);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const addMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ROUTES.MEDIAS, {
        serial,
        titulo,
        sinopsis,
        productora,
        tipo,
        director,
        genero,
        imagen,
        urlPelicula,
        ano_estreno: anoEstreno,
      });
      setMedias([...medias, response.data as Media]);
      resetForm();
    } catch (error) {
      console.error("Error adding media:", error);
    }
  };

  const deleteMedia = async (_id: string) => {
    try {
      await axios.delete(`${API_ROUTES.MEDIAS}/${_id}`);
      setMedias(medias.filter((media) => media._id !== _id));
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const startEditMedia = (media: Media) => {
    setEditId(media._id);
    setSerial(media.serial);
    setTitulo(media.titulo);
    setSinopsis(media.sinopsis);
    setProductora(media.productora);
    setTipo(media.tipo);
    setDirector(media.director);
    setGenero(media.genero);
    setImagen(media.imagen);
    setUrlPelicula(media.urlPelicula);
    setAnoEstreno(new Date(media.ano_estreno));
  };

  const updateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null) return;
    try {
      const response = await axios.put(`${API_ROUTES.MEDIAS}/${editId}`, {
        serial,
        titulo,
        sinopsis,
        productora,
        tipo,
        director,
        genero,
        imagen,
        urlPelicula,
        ano_estreno: anoEstreno,
      });
      setMedias(
        medias.map((media) =>
          media._id === editId ? (response.data as Media) : media
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating media:", error);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setSerial("");
    setTitulo("");
    setSinopsis("");
    setProductora("");
    setTipo("");
    setDirector("");
    setGenero("");
    setImagen(null);
    setUrlPelicula("");
    setAnoEstreno(new Date());
  };

  // Función para regresar al menú principal
  const goBackToMenu = () => {
    router.push('/');  // Redirige al panel de inicio
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Medias
          </h1>
          <form onSubmit={editId ? updateMedia : addMedia} className="mb-8">
            <div className="mb-4">
              <input
                type="text"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="Serial"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <textarea
                value={sinopsis}
                onChange={(e) => setSinopsis(e.target.value)}
                placeholder="Sinopsis"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dropdown para Productora */}
            <div className="mb-4">
              <select
                value={productora}
                onChange={(e) => setProductora(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione una productora</option>
                {productoras.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown para Tipo */}
            <div className="mb-4">
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un tipo</option>
                {tipos.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown para Director */}
            <div className="mb-4">
              <select
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un director</option>
                {directores.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown para Género */}
            <div className="mb-4">
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un género</option>
                {generos.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Datepicker para Año de Estreno */}
            <div className="mb-4">
              <DatePicker
                selected={anoEstreno}
                onChange={(date: Date | null) => setAnoEstreno(date)}
                showYearPicker
                dateFormat="yyyy"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <input
                type="url"
                value={urlPelicula}
                onChange={(e) => setUrlPelicula(e.target.value)}
                placeholder="URL de la Película"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              {editId ? "Actualizar" : "Agregar"} Media
            </button>
          </form>

          {/* Botón para regresar al menú principal */}
          <button
            onClick={goBackToMenu}
            className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300 mb-4"
          >
            Volver al Panel de Inicio
          </button>

          {/* Listado de medias */}
          <ul className="space-y-4">
            {medias.map((media) => (
              <li
                key={media._id}
                className="p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <p className="text-xl font-semibold text-gray-800">
                  {media.titulo}
                </p>
                <p className="text-gray-600">{media.sinopsis}</p>
                <p className="text-gray-600">
                  Año de estreno: {media.ano_estreno.getFullYear()}
                </p>
                <p className="text-gray-600">URL: {media.urlPelicula}</p>
                <p className="text-sm text-gray-500">
                  Creado: {new Date(media.fechaCreacion).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Actualizado:{" "}
                  {new Date(media.fechaActualizacion).toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => startEditMedia(media)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteMedia(media._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Medias;

