import axios from 'axios';
import ILogin from '~/main/interfaces/ILogin';
import IRegister from '~/main/interfaces/IRegister';
import IResponseLogin from '~/main/interfaces/IResponseLogin';
import IUser from '~/main/interfaces/IUser';

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

  validateUser: async() => {
    if (localStorage.token) {
      const config = {
        headers: {
          Authorization: localStorage.token,
        }
      }
      const response: IUser = await axios.get("http://localhost:4000/validate", config).then(x => x.data);
      return response;
    }
  }
}

export default authenticationController;