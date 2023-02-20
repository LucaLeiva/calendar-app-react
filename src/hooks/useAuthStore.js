import { useDispatch, useSelector } from "react-redux";
import calendarApi from "../api/calendarApi";
import { clearErrorMessage, onChecking, onLogin, onLougout } from "../store/auth/authSlice";


// Otra forma de interactuar con el store en vez de thunks
export const useAuthStore = () => {

  const { status, user, errorMessage } = useSelector(state => state.auth);
  const dispatch = useDispatch()

  const startLogin = async({ email, password }) => {

    dispatch(onChecking());

    try {
      
      const { data } = await calendarApi.post("/usuarios/login", {
        email: email,
        contraseña: password
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());

      dispatch(onLogin({ name: data.nombre, uid: data.uid }))

    } catch (error) {
      dispatch(onLougout("Credenciales incorrectas"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  }

  const startRegister = async({ email, password, name }) => {

    dispatch(onChecking());

    try {
      
      const { data } = await calendarApi.post("/usuarios/", {
        email: email,
        contraseña: password,
        nombre: name
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());

      dispatch(onLogin({ name: data.nombre, uid: data.uid }))

    } catch (error) {
      dispatch(onLougout(error.response.data?.msg || "Error al crear usuario"));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  }

  const checkAuthToken = async() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return dispatch(onLougout());
    }

    try {
      
      const { data } = await calendarApi.get("usuarios/renew");
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());

      dispatch(onLogin({ name: data.nombre, uid: data.uid }))
      
    } catch (error) {
      localStorage.clear();
      dispatch(onLougout());
    }
  }

  const startLogout = () => {
    localStorage.clear();

    dispatch(onLougout());
  }

  return {
    status,
    user,
    errorMessage,
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout
  }
}