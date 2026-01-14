import "./loginScreen.css"
import { useEffect, useState } from "react"; // Guardo lo que escribe el usuario
import { useNavigate } from "react-router-dom" // Para pasar a la proxima pantalla
import { useUser } from "../../context/UserContext"
import { useGame } from "../../context/GameContext"

function Login() {
  const navigate = useNavigate();
  const { userDispatch } = useUser();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    avatar: ''
  })
  const [error, setError] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  const validarNombre = (nombre) => {
    if(nombre.length > 15) {
      return 'El nombre no puede tener mas de 15 caracteres';
    }

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]*$/;   
    if(!nameRegex.test(nombre)) {
      return 'El nombre solo pueda contener letras, números y espacios';
    }
    
    if (nombre.trim().length === 0 && nombre.length > 0) {
      return 'El nombre no puede estar vacío';
    } 
  }

  const validarEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailRegex.test(email)) {
      return 'El email no es correcto';
    }

    if (email.trim().length === 0 && email.length > 0) {
      return 'El email no puede estar vacío';
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if(!formData.nombre || !formData.email || !formData.avatar) {
      setError('todos los campos son obligatorios');
      return;
    }

    const errorNombre = validarNombre(formData.nombre);
    if(errorNombre) {
      setError(errorNombre);
      return;
    }

    const errorEmail = validarEmail(formData.email);
    if(errorEmail) {
      setError(errorEmail);
      return;
    }

    const existe = usuarios.some(u =>
      u.nombre

    )



  }

}

export default Login;