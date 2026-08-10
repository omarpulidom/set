import {
  GeistMono_100Thin,
  GeistMono_100Thin_Italic,
  GeistMono_200ExtraLight,
  GeistMono_200ExtraLight_Italic,
  GeistMono_300Light,
  GeistMono_300Light_Italic,
  GeistMono_400Regular,
  GeistMono_400Regular_Italic,
  GeistMono_500Medium,
  GeistMono_500Medium_Italic,
  GeistMono_600SemiBold,
  GeistMono_600SemiBold_Italic,
  GeistMono_700Bold,
  GeistMono_700Bold_Italic,
  GeistMono_800ExtraBold,
  GeistMono_800ExtraBold_Italic,
  GeistMono_900Black,
  GeistMono_900Black_Italic,
} from '@expo-google-fonts/geist-mono'
import { GFSDidot_400Regular } from '@expo-google-fonts/gfs-didot'
import { LibreBarcode39_400Regular } from '@expo-google-fonts/libre-barcode-39'
import {
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk'

const LocalFonts = {
  BiroScript: require('@/assets/fonts/Biro_Script_Regular.ttf'),
  Merchant: require('@/assets/fonts/Merchant_Regular.ttf'),
  Salbabida: require('@/assets/fonts/Salbabida_Regular.otf'),
} as const

export const AppFonts = {
  GFSDidot_400Regular,

  LibreBarcode39_400Regular,

  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,

  GeistMono_100Thin,
  GeistMono_100Thin_Italic,
  GeistMono_200ExtraLight,
  GeistMono_200ExtraLight_Italic,
  GeistMono_300Light,
  GeistMono_300Light_Italic,
  GeistMono_400Regular,
  GeistMono_400Regular_Italic,
  GeistMono_500Medium,
  GeistMono_500Medium_Italic,
  GeistMono_600SemiBold,
  GeistMono_600SemiBold_Italic,
  GeistMono_700Bold,
  GeistMono_700Bold_Italic,
  GeistMono_800ExtraBold,
  GeistMono_800ExtraBold_Italic,
  GeistMono_900Black,
  GeistMono_900Black_Italic,

  BiroScript: LocalFonts.BiroScript,
  Merchant: LocalFonts.Merchant,
  Salbabida: LocalFonts.Salbabida,
} as const

export type AppFontKeys = keyof typeof AppFonts
