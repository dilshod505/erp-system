import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface LayoutState {
  username: string | null;
  token: string | null;
  user: Record<string, any> | null;
  setCredentials: (email: string, token: string) => void;
  clearCredentials: () => void;
  setUser: (user: Record<string, any>) => void;
  logout: () => void;
}

const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      username: null,
      token: null,
      user: null,
      setCredentials: (username, token) =>
        set(() => ({
          username,
          token,
        })),
      clearCredentials: () =>
        set(() => ({
          username: null,
          token: null,
        })),
      setUser: (user: Record<string, any>) => set(() => ({ user })),
      logout: () => {
        set(() => ({
          username: null,
          token: null,
          user: null,
        }));
        Cookies.remove("aifu-token");
      },
    }),
    {
      name: "aifu-token",
      partialize: (state) => ({
        username: state.username,
        token: state.token,
        user: state.user,
      }),
    },
  ),
);

export default useLayoutStore;
