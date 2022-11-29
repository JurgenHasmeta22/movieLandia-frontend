import axios from 'axios';
import ILogin from '../store/zustand/types/ILogin';
import IRegister from '../store/zustand/types/IRegister';
import IResponseLogin from '../store/zustand/types/IResponseLogin';

const authenticationController = {
  onLogin: async(email: string, password: string): Promise<any> => {
    const payload: ILogin = {
      email,
      password
    };
    const responseLogin: IResponseLogin = await axios.post("http://localhost:4000/login", payload).then(x => x.data);
    return responseLogin;
  },

  onRegister: async(username: string, email: string, password: string): Promise<any> => {
    const payload: IRegister = {
      username,
      email,
      password
    };
    const responseLogin: IResponseLogin = await axios.post("http://localhost:4000/sign-up", payload).then(x => x.data);
    return responseLogin;
  },
}

export default authenticationController;