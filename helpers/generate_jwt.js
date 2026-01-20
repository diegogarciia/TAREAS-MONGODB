import jwt from 'jsonwebtoken'


export const generarJWT = (uid = '') => {
    console.log("UID:" + uid)
    let token = jwt.sign({ uid }, process.env.SECRETORPRIVATEKEY, {
        expiresIn: '4h' 
      });
    return token;
}


export const generarJWT_Roles = (uid = '', roles = []) => {
    console.log("UID:" + uid)
    let token = jwt.sign({ uid, roles }, process.env.SECRETORPRIVATEKEY, {
        expiresIn: '4h' 
      });
      console.log('Token generado: ', token)
    return token;
}