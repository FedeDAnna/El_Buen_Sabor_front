export default interface RegistroDTO {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fecha_nacimiento: string; // O Date si tu backend lo acepta
  password: string;
}
