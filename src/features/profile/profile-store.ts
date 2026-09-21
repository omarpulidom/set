import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { zustandMMKVStorage } from '@/lib/mmkv'

type ProfileStore = {
  username: string
  setUsername: (username: string) => void
  resetProfile: () => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      username: '',
      setUsername: (username) =>
        set({
          username: username.trim(),
        }),
      resetProfile: () =>
        set({
          username: '',
        }),
    }),
    {
      name: 'set-profile-v1',
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
)
