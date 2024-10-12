import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ROUTES from "../app/services/api";
import Layout from "@/app/layout";
import { useRouter } from "next/router";  // Importar useRouter

interface Tipo {
  _id: string;
  nombre: string;
  descripcion: string;
  estado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

/**
 * Componente para gestionar tipos.
 *
 * Este componente permite a los usuarios ver, agregar, editar y eliminar tipos. Obtiene la lista de tipos de una API y los muestra en una lista. Los usuarios pueden agregar nuevos tipos, editar los existentes y eliminar tipos.
 *
 * @component
 * @example
 * return (
 *   <Tipos />
 * )
 *
 * @returns {React.FC} El componente Tipos.
 */
const Tipos: React.FC = () => {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const router = useRouter();  // Inicializar el enrutador

  useEffect(() => {
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    try {
      const response = await axios.get(API_ROUTES.TIPOS);
      const data = response.data as Tipo[];

      if (data && data.length > 0) {
        console.log("Tipos obtenidos:", data);
        setTipos(data);
      } else {
        console.error("La respuesta no contiene tipos.");
      }
    } catch (error) {
      console.error("Error fetching tipos:", error);
    }
  };

  const addTipo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ROUTES.TIPOS, {
        nombre,
        descripcion,
        estado,
      });
      setTipos([...tipos, response.data as Tipo]);
      resetForm();
    } catch (error) {
      console.error("Error adding tipo:", error);
    }
  };

  const deleteTipo = async (_id: string) => {
    if (_id === undefined || _id === null) {
      console.error("ID inválido para eliminar");
      return;
    }

    try {
      await axios.delete(`${API_ROUTES.TIPOS}/${_id}`);
      setTipos(tipos.filter((tipo) => tipo._id !== _id));
    } catch (error) {
      console.error("Error deleting tipo:", error);
    }
  };

  const startEditTipo = (tipo: Tipo) => {
    setEditId(tipo._id);
    setNombre(tipo.nombre);
    setDescripcion(tipo.descripcion);
    setEstado(tipo.estado);
  };

  const updateTipo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null) return;
    try {
      const response = await axios.put(`${API_ROUTES.TIPOS}/${editId}`, {
        nombre,
        descripcion,
        estado,
      });
      setTipos(
        tipos.map((tipo) =>
          tipo._id === editId ? (response.data as Tipo) : tipo
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating tipo:", error);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setNombre("");
    setDescripcion("");
    setEstado(false);
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
            Tipos
          </h1>
          <form onSubmit={editId ? updateTipo : addTipo} className="mb-8">
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
              {editId ? "Actualizar" : "Agregar"} Tipo
            </button>
          </form>

          {/* Botón para regresar al menú principal */}
          <button
            onClick={goBackToMenu}
            className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300 mb-4"
          >
            Volver al Panel de Inicio
          </button>

          <ul className="space-y-4">
            {tipos.map((tipo) => (
              <li
                key={tipo._id}
                className="p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <p className="text-xl font-semibold text-gray-800">
                  {tipo.nombre}
                </p>
                <p className="text-gray-600">{tipo.descripcion}</p>
                <p className="text-gray-600">
                  Estado: {tipo.estado ? "Activo" : "Inactivo"}
                </p>
                <p className="text-sm text-gray-500">
                  Creado: {new Date(tipo.fechaCreacion).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Actualizado:{" "}
                  {new Date(tipo.fechaActualizacion).toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => startEditTipo(tipo)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteTipo(tipo._id)}
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

export default Tipos;
