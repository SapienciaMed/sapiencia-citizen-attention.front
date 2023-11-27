import * as yup from "yup";

export const loginValidator = yup.object({
  numberDocument: yup
    .string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .max(15, "Solo se permiten 15 caracteres")
    .min(6, "Ingresa al menos 6 caracteres")
    .required("El número de documento es obligatorio"),
  password: yup
    .string()
    .min(7, "Ingrese al menos 7 caracteres")
    .max(16, "Solo se permiten 16 caracteres")
    .required("La contraseña es obligatoria"),
});

export const recoveryPassword = yup.object({
  identification: yup
    .string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .required("El número de documento es obligatorio"),
  email: yup
    .string()
    .email("Correo no valido")
    .required("El correo es obligatorio"),
});

export const createUsers = yup.object({
  names: yup
  .string()
  .required("El nombre de usuario es obligatorio"),
  lastNames: yup.string().required("El apellido del usuario es obligatorio"),
  typeDocument: yup.string().required("El tipo de documento es obligatorio"),
  numberDocument: yup
    .string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .required("El número de documento es obligatorio"),
  email: yup
    .string()
    .email("Correo no valido")
    .required("El correo es obligatorio"),
  
  gender: yup.string().required("El género es obligatorio"), 
  deparmentCode: yup.string().required("El departamento es obligatorio"),
  townCode: yup.string().required("El municipio es obligatorio"),
  address: yup.string().required("La dirección es obligatoria"),
  neighborhood: yup.string().required("El barrio es obligatorio"),  
  contactNumber1: yup.string().nullable().max(10, "El número de contacto debe tener un máximo de 10 caracteres."),
  dependency: yup.string().nullable().optional(),
  charge: yup.string().nullable().optional(),  
});


export const createUsersWithCharge = yup.object({
  names: yup
  .string()
  .required("El nombre de usuario es obligatorio"),
  lastNames: yup.string().required("El apellido del usuario es obligatorio"),
  typeDocument: yup.string().required("El tipo de documento es obligatorio"),
  numberDocument: yup
    .string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .required("El número de documento es obligatorio"),
  email: yup
    .string()
    .email("Correo no valido")
    .required("El correo es obligatorio"),
  
  gender: yup.string().required("El género es obligatorio"), 
  deparmentCode: yup.string().required("El departamento es obligatorio"),
  townCode: yup.string().required("El municipio es obligatorio"),
  address: yup.string().required("La dirección es obligatoria"),
  neighborhood: yup.string().required("El barrio es obligatorio"),  
  dependency: yup.string().nullable().optional(),
  charge: yup.string().required("El cargo es obligatorio"),
});


export const changePassword = yup.object({
  password: yup
    .string()
    .min(8, "Ingrese al menos 8 caracteres")
    .matches(/[0-9]/, "La contraseña debe contener al menos un número.")
    .required("La contraseña es obligatoria."),
  confirmPassword: yup
    .string()
    .min(8, "Ingrese al menos 8 caracteres")
    .required("La contraseña es obligatoria.")
    .matches(/[0-9]/, "La contraseña debe contener al menos un número.")
    .oneOf(
      [yup.ref("password")],
      "Las contraseñas no coinciden, por favor verificar la información."
    ),
});

export const roleValidator = yup.object({
  nombreRol: yup.string().required("El nombre del rol es obligatorio"),
  descripcionRol: yup
    .string()
    .required("La descripción del rol es obligatoria"),
});

export const systemUserValidator = yup.object({
  documentNumber: yup.string().optional(),
  names: yup.string().optional(),
  lastNames: yup.string().optional(),
  email: yup.string().optional().email("Correo no valido"),
});

export const profileValidator = yup.object({
  aplicationId: yup.string().required("Requerido!"),
  dateValidity: yup.date().required("Requerido!"),
});
