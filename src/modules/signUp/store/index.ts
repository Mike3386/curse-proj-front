import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { useAuthStore } from "../../../authStore";
import { toast } from "react-toastify";

interface SignUpState {
  email: string;
  password1: string;
  password2: string;
  username: string;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword1: (password: string) => void;
  setPassword2: (password: string) => void;
  signUp: () => Promise<any> | any;
}

export interface User {
  id: string;
  email: string;
}

export const useSignInStore = create<SignUpState>()(
  immer((set, get) => ({
    email: "",
    password1: "",
    password2: "",
    username: "",
    setUsername: (username) => set({ username }),
    setEmail: (email: string) => set({ email }),
    setPassword1: (password: string) => set({ password1: password }),
    setPassword2: (password: string) => set({ password2: password }),
    signUp: () => {
      if (!get().email || !get().password1 || !get().password2) {
        toast.warn("Логин и пароль должны быть указаны", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      if (!get().password1 !== !get().password2) {
        toast.warn("Пароли должны совпадать", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      return axios
        .post("/auth/register", {
          email: get().email,
          password: get().password1,
          username: get().username,
          firstName: "",
          lastName: "",
        })
        .then((res) => {})
        .catch((error) => {
          console.log(error);
          toast.error("Email занят", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    },
  }))
);
