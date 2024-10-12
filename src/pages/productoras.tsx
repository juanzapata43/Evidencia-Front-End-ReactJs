import React, { useState, useEffect } from "react";
import axios from "axios";
import API_ROUTES from "../app/services/api";
import Layout from "@/app/layout";
import { useRouter } from "next/router"; // Importar useRouter

interface Productora {
  _id: string;
  nombre: string;
  slogan: string;
  descripcion: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

const Productoras: React.FC = () => {
  const [productoras, setProductoras] = useState<Productora[]>([]);
  const [nombre, setNombre] = useState("");
  const [slogan, setSlogan] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const router = useRouter(); // Inicializar el enrutador para la redirección

  useEffect(() => {
    fetchProductoras();
  }, []);

  const fetchProductoras = async () => {
    try {
      const response = await axios.get(API_ROUTES.PRODUCTORAS);
      const data = response.data as Productora[];

      if (data && data.length > 0) {
        console.log("Productoras obtenidas:", data);
        setProductoras(data);
      } else {
        console.error("La respuesta no contiene productoras.");
      }
    } catch (error) {
      console.error("Error fetching productoras:", error);
    }
  };

  const addProductora = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_ROUTES.PRODUCTORAS, {
        nombre,
        slogan,
        descripcion,
      });
      setProductoras([...productoras, response.data as Productora]);
      resetForm();
    } catch (error) {
      console.error("Error adding productora:", error);
    }
  };

  const deleteProductora = async (_id: string) => {
    if (_id === undefined || _id === null) {
      console.error("ID inválido para eliminar");
      return;
    }

    try {
      await axios.delete(`${API_ROUTES.PRODUCTORAS}/${_id}`);
      setProductoras(productoras.filter((productora) => productora._id !== _id));
    } catch (error) {
      console.error("Error deleting productora:", error);
    }
  };

  const startEditProductora = (productora: Productora) => {
    setEditId(productora._id);
    setNombre(productora.nombre);
    setSlogan(productora.slogan);
    setDescripcion(productora.descripcion);
  };

  const updateProductora = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null) return;
    try {
      const response = await axios.put(`${API_ROUTES.PRODUCTORAS}/${editId}`, {
        nombre,
        slogan,
        descripcion,
      });
      setProductoras(
        productoras.map((productora) =>
          productora._id === editId ? (response.data as Productora) : productora
        )
      );
      resetForm();
    } catch (error) {
      console.error("Error updating productora:", error);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setNombre("");
    setSlogan("");
    setDescripcion("");
  };

  // Función para regresar al menú principal
  const goBackToMenu = () => {
    router.push('/'); // Redirige al panel de inicio
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Productoras
          </h1>
          <form onSubmit={editId ? updateProductora : addProductora} className="mb-8">
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
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Slogan"
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
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              {editId ? "Actualizar" : "Agregar"} Productora
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
            {productoras.map((productora) => (
              <li
                key={productora._id}
                className="p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <p className="text-xl font-semibold text-gray-800">
                  {productora.nombre}
                </p>
                <p className="text-gray-600">{productora.slogan}</p>
                <p className="text-gray-600">{productora.descripcion}</p>
                <p className="text-sm text-gray-500">
                  Creado: {new Date(productora.fechaCreacion).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Actualizado:{" "}
                  {new Date(productora.fechaActualizacion).toLocaleDateString()}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => startEditProductora(productora)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteProductora(productora._id)}
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

export default Productoras;
