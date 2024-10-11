import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ROUTES from "../app/services/api";
import Layout from "@/app/layout";

interface Genero {
  _id: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

/**
 * Componente para gestionar géneros.
 *
 * Este componente permite a los usuarios ver, agregar, editar y eliminar géneros. Obtiene la lista de géneros de una API y los muestra en una lista. Los usuarios pueden agregar nuevos géneros, editar los existentes y eliminar géneros. El componente también incluye un formulario para agregar y editar géneros.
 *
 * @component
 * @example
 * return (
 *   <Generos />
 * )
 *
 * @returns {React.FC} El componente Generos.
 *
 * @typedef {Object} Genero
 * @property {string} _id - El identificador único del género.
 * @property {string} nombre - El nombre del género.
 * @property {string} descripcion - La descripción del género.
 * @property {boolean} estado - El estado del género (activo/inactivo).
 * @property {Date} fechaCreacion - La fecha de creación del género.
 * @property {Date} fechaActualizacion - La última fecha de actualización del género.
 *
 * @typedef {Object} API_ROUTES
 * @property {string} GENEROS - El endpoint de la API para géneros.
 *
 * @function fetchGeneros
 * @description Obtiene la lista de géneros de la API y actualiza el estado.
 *
 * @function addGenero
 * @description Agrega un nuevo género a la lista enviando una solicitud POST a la API.
 * @param {React.FormEvent} e - El evento de envío del formulario.
 *
 * @function deleteGenero
 * @description Elimina un género de la lista enviando una solicitud DELETE a la API.
 * @param {string} _id - El identificador único del género a eliminar.
 *
 * @function startEditGenero
 * @description Llena el formulario con los datos del género a editar.
 * @param {Genero} genero - El género a editar.
 *
 * @function updateGenero
 * @description Actualiza un género existente enviando una solicitud PUT a la API.
 * @param {React.FormEvent} e - El evento de envío del formulario.
 *
 * @function resetForm
 * @description Restablece los campos del formulario a su estado inicial.
 */
const Generos: React.FC = () => {
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchGeneros();
  }, []);

  const fetchGeneros = async () => {
    try {
      const response = await axios.get(API_ROUTES.GENEROS);
      const data = response.data as Genero[];

      if (data && data.length > 0) {
        console.log("Generos obtenidos:", data);
        setGeneros(data);
      } else {
        console.error("La respuesta no contiene géneros.");
      }
    } catch (error) {
      console.error("Error fetching generos:", error);
    }
  };

  const addGenero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ROUTES.GENEROS, {
        nombre,
        descripcion,
        estado,
      });
      setGeneros([...generos, response.data as Genero]);
      resetForm();
    } catch (error) {
      console.error("Error adding genero:", error);
    }
  };

  const deleteGenero = async (_id: string) => {
    if (_id === undefined || _id === null) {
      console.error("ID inválido para eliminar");
      return;
    }

    try {
      await axios.delete(`${API_ROUTES.GENEROS}/${_id}`);
      setGeneros(generos.filter((genero) => genero._id !== _id));
    } catch (error) {
      console.error("Error deleting genero:", error);
    }
  };

  const startEditGenero = (genero: Genero) => {
    setEditId(genero._id);
    setNombre(genero.nombre);
    setDescripcion(genero.descripcion);
    setEstado(genero.estado);
  };

  const updateGenero = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null) return;
    try {
      const response = await axios.put(`${API_ROUTES.GENEROS}/${editId}`, {
        nombre,
        descripcion,
        estado,
      });
      setGeneros(
        generos.map((genero) =>
          genero._id === editId ? (response.data as Genero) : genero
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating genero:", error);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setNombre("");
    setDescripcion("");
    setEstado(false);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Géneros
          </h1>
          <form onSubmit={editId ? updateGenero : addGenero} className="mb-8">
            <div className="mb-4">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={estado}
                  onChange={(e) => setEstado(e.target.checked)}
                  className="mr-2"
                />
                Estado
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              {editId ? "Actualizar" : "Agregar"} Género
            </button>
          </form>
          <ul className="space-y-4">
            {generos.map((genero) => (
              <li
                key={genero._id}
                className="p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <p className="text-xl font-semibold text-gray-800">
                  {genero.nombre}
                </p>
                <p className="text-gray-600">{genero.descripcion}</p>
                <p className="text-gray-600">
                  Estado: {genero.estado ? "Activo" : "Inactivo"}
                </p>
                <p className="text-sm text-gray-500">
                  Creado: {new Date(genero.fechaCreacion).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Actualizado:{" "}
                  {new Date(genero.fechaActualizacion).toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => startEditGenero(genero)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteGenero(genero._id)}
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

export default Generos;
