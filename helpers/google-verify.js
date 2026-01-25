import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

export const googleVerify = async( idToken = '' ) => {
    try {
      if (!idToken) {
        throw new Error('El token de identificación (idToken) no fue proporcionado.');
      }

      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, 
      });

      if (!ticket) {
        throw new Error('No se pudo verificar el token.');
      }

      console.log(ticket); 

      const payload = ticket.getPayload();

      if (!payload) {
        throw new Error('El payload del token no contiene información válida.');
      }

      const { name: nombre, picture: img, email: correo } = payload;

      return { nombre, img, correo };

    } catch (error) {
        console.error('Error en la verificación del token:', error.message);

        throw new Error(`Error en la verificación del token: ${error.message}`);
    }

}