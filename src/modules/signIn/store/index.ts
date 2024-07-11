import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axios from "axios";
import { useAuthStore } from "../../../authStore";
import { useLocation } from "wouter";
import { toast } from "react-toastify";

interface SignInState {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  signIn: () => Promise<any>;
}

export interface User {
  id: string;
  email: string;
}

export const useSignInStore = create<SignInState>()(
  immer((set, get) => ({
    email: "",
    password: "",
    setEmail: (email: string) => set({ email }),
    setPassword: (password: string) => set({ password }),
    signIn: async () => {
      if (!get().email || !get().password) {
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
        return Promise.reject();
      }

      await axios
        .post("/auth/login", { email: get().email, password: get().password })
        .then((res) => {
          console.log(res.status);
          if (res.status === 401) throw new Error("");
          useAuthStore.getState().setAuthUser(
            {
              email: res.data.email,
              isAdmin: res.data.isAdmin,
              id: res.data.id,
              username: res.data.username,
            },
            res.data.access_token
          );
        })
        .catch((error) => {
          console.log(error);
          toast.error("Проверьте логин и пароль", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return Promise.reject(error);
          // useLocation()[1]('/', {replace: true})
        });
    },
  }))
);
