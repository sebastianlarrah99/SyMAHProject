import { useContext } from "react";
import RoleContext from "./RoleProvider";

export const useRole = () => useContext(RoleContext);
