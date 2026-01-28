import React, { createContext, useState, useEffect } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(undefined); // Cambiar el estado inicial a undefined

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    console.log("Rol almacenado en localStorage:", storedRole);
    if (storedRole) {
      setRole(storedRole);
    } else {
      setRole("guest"); // Rol predeterminado si no hay ninguno almacenado
    }
    console.log("Rol inicial establecido:", storedRole ? storedRole : "guest");
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem("role");
      console.log("Rol actualizado desde localStorage:", updatedRole);
      setRole(updatedRole || "guest");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    console.log(
      "Verificando localStorage al cargar el RoleProvider:",
      localStorage,
    );
  }, []);

  if (role === undefined) {
    // Mostrar un indicador de carga mientras se obtiene el rol
    return <div>Cargando...</div>;
  }

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;
