"use client";

import React from "react";
import "../app/globals.css";

/**
 * Componente de diseño que sirve como contenedor para componentes hijos.
 *
 * @param {Object} props - El objeto de propiedades.
 * @param {React.ReactNode} props.children - Los componentes hijos que se renderizarán dentro del diseño.
 * @returns {JSX.Element} El componente de diseño renderizado.
 */

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;

