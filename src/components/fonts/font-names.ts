import type { AppFontKeys } from './fonts'

export const AppFontNames = {
  GFSDidot_400Regular: 'GFSDidot_400Regular',

  LibreBarcode39_400Regular: 'LibreBarcode39_400Regular',

  SpaceGrotesk_300Light: 'SpaceGrotesk_300Light',
  SpaceGrotesk_400Regular: 'SpaceGrotesk_400Regular',
  SpaceGrotesk_500Medium: 'SpaceGrotesk_500Medium',
  SpaceGrotesk_600SemiBold: 'SpaceGrotesk_600SemiBold',
  SpaceGrotesk_700Bold: 'SpaceGrotesk_700Bold',

  GeistMono_100Thin: 'GeistMono_100Thin',
  GeistMono_100Thin_Italic: 'GeistMono_100Thin_Italic',
  GeistMono_200ExtraLight: 'GeistMono_200ExtraLight',
  GeistMono_200ExtraLight_Italic: 'GeistMono_200ExtraLight_Italic',
  GeistMono_300Light: 'GeistMono_300Light',
  GeistMono_300Light_Italic: 'GeistMono_300Light_Italic',
  GeistMono_400Regular: 'GeistMono_400Regular',
  GeistMono_400Regular_Italic: 'GeistMono_400Regular_Italic',
  GeistMono_500Medium: 'GeistMono_500Medium',
  GeistMono_500Medium_Italic: 'GeistMono_500Medium_Italic',
  GeistMono_600SemiBold: 'GeistMono_600SemiBold',
  GeistMono_600SemiBold_Italic: 'GeistMono_600SemiBold_Italic',
  GeistMono_700Bold: 'GeistMono_700Bold',
  GeistMono_700Bold_Italic: 'GeistMono_700Bold_Italic',
  GeistMono_800ExtraBold: 'GeistMono_800ExtraBold',
  GeistMono_800ExtraBold_Italic: 'GeistMono_800ExtraBold_Italic',
  GeistMono_900Black: 'GeistMono_900Black',
  GeistMono_900Black_Italic: 'GeistMono_900Black_Italic',

  BiroScript: 'BiroScript',
  Merchant: 'Merchant',
  Salbabida: 'Salbabida',
} as const satisfies {
  [key in AppFontKeys]: AppFontKeys
}
