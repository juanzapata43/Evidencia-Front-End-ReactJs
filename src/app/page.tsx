"use client";
import React from "react";
import Dashboard from "@/pages/dashboard";
import Layout from "@/app/layout";

/**
 * Componente Home que sirve como punto de entrada principal para la aplicación.
 * Renderiza el componente Layout que contiene el componente Dashboard.
 *
 * @returns {JSX.Element} El componente Home renderizado.
 */

const Home = () => {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default Home;
