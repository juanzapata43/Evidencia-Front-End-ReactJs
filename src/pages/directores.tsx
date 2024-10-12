import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ROUTES from "../app/services/api";
import Layout from "@/app/layout";
import { useRouter } from "next/router";  // Importa useRouter

interface Director {
  _id: string;
  nombre: string;
  estado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

/**
 * Componente para gestionar directores.
 *
 * Este componente permite a los usuarios ver, agregar, editar y eliminar directores. Obtiene la lista de directores de una API y los muestra en una lista. Los usuarios pueden agregar nuevos directores, editar los existentes y eliminar directores.
 *
 * @component
 * @example
 * return (
 *   <Directores />
 * )
 *
 * @returns {React.FC} El componente Directores.
 */
const Directores: React.FC = () => {
  const [directores, setDirectores] = useState<Director[]>([]);
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const router = useRouter();  // Inicializa el enrutador

  useEffect(() => {
    fetchDirectores();
  }, []);

  const fetchDirectores = async () => {
    try {
      const response = await axios.get(API_ROUTES.DIRECTORES);
      const data = response.data as Director[];

      if (data && data.length > 0) {
        console.log("Directores obtenidos:", data);
        setDirectores(data);
      } else {
        console.error("La respuesta no contiene directores.");
      }
    } catch (error) {
      console.error("Error fetching directores:", error);
    }
  };

  const addDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ROUTES.DIRECTORES, {
        nombre,
        estado,
      });
      setDirectores([...directores, response.data as Director]);
      resetForm();
    } catch (error) {
      console.error("Error adding director:", error);
    }
  };

  const deleteDirector = async (_id: string) => {
    if (_id === undefined || _id === null) {
      console.error("ID inválido para eliminar");
      return;
    }

    try {
      await axios.delete(`${API_ROUTES.DIRECTORES}/${_id}`);
      setDirectores(directores.filter((director) => director._id !== _id));
    } catch (error) {
      console.error("Error deleting director:", error);
    }
  };

  const startEditDirector = (director: Director) => {
    setEditId(director._id);
    setNombre(director.nombre);
    setEstado(director.estado);
  };

  const updateDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null) return;
    try {
      const response = await axios.put(`${API_ROUTES.DIRECTORES}/${editId}`, {
        nombre,
        estado,
      });
      setDirectores(
        directores.map((director) =>
          director._id === editId ? (response.data as Director) : director
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating director:", error);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setNombre("");
    setEstado(false);
  };

  // Función para regresar al menú principal
  const goBackToMenu = () => {
    router.push('/');  // Redirige al panel de inicio (dashboard)
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Directores
          </h1>
          <form onSubmit={editId ? updateDirector : addDirector} className="mb-8">
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
              {editId ? "Actualizar" : "Agregar"} Director
            </button>
          </form>

          {/* Agrega el botón para volver al menú principal */}
          <button
            onClick={goBackToMenu}
            className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-300 mb-4"
          >
            Volver al Panel de Inicio
          </button>

          <ul className="space-y-4">
            {directores.map((director) => (
              <li
                key={director._id}
                className="p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <p className="text-xl font-semibold text-gray-800">
                  {director.nombre}
                </p>
                <p className="text-gray-600">
                  Estado: {director.estado ? "Activo" : "Inactivo"}
                </p>
                <p className="text-sm text-gray-500">
                  Creado: {new Date(director.fechaCreacion).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Actualizado:{" "}
                  {new Date(director.fechaActualizacion).toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => startEditDirector(director)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteDirector(director._id)}
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

export default Directores;
