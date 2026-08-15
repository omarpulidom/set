import { ScrollView, Text, View } from 'react-native'
import { GymScreen, WeekStrip } from '@/components/gym/GymUI'
import { TrainingChart } from '@/components/gym/TrainingChart'
import { mockProfile, mockProgress } from '@/features/gym/mock-data'

export default function StatsTab() {
  const progress = mockProfile.completedDaysThisWeek / mockProfile.weeklyGoalDays
  const remainingSessions = mockProfile.weeklyGoalDays - mockProfile.completedDaysThisWeek

  return (
    <GymScreen title='Progreso'>
      <ScrollView
        className='flex-1 px-5'
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <View className='mt-2 rounded-3xl border border-border-soft bg-surface-muted px-6 pb-6 pt-8'>
          <View className='flex-row items-end'>
            <Text className='font-geist-mono-light text-6xl tracking-[-4px] text-surface-dark'>
              {mockProfile.completedDaysThisWeek}/{mockProfile.weeklyGoalDays}
            </Text>
            <Text className='mb-2 ml-4 font-geist-mono text-xs leading-4 text-ink-subtle'>
              entrenamientos{`\n`}esta semana
            </Text>
          </View>
          <View className='mt-6 h-2 overflow-hidden rounded-full bg-border-soft'>
            <View
              className='h-full rounded-full bg-surface-dark'
              style={{
                width: `${progress * 100}%`,
              }}
            />
          </View>
          <Text className='mt-4 font-geist-mono-medium text-xs text-ink-muted'>
            {remainingSessions === 1
              ? 'Falta 1 entrenamiento para tu meta'
              : `Faltan ${remainingSessions} entrenamientos para tu meta`}
          </Text>
        </View>

        <View className='mt-6'>
          <WeekStrip />
        </View>

        <View className='mt-8'>
          <Text className='font-geist-mono text-[10px] tracking-[2px] text-ink-subtle'>
            TUS NÚMEROS
          </Text>
          <Text className='mt-1 font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-dark'>
            Progreso de fuerza
          </Text>
        </View>

        <View className='mt-4 rounded-3xl border border-border-soft bg-surface-muted px-5'>
          <TrainingChart
            title='VOLUMEN'
            summary='4.8t ~ 6.1t | 5.4t'
            values={mockProgress.map((point) => point.volumeKg)}
            unit='PRESS BANCA'
          />
          <TrainingChart
            title='MEJOR PESO'
            summary='65kg ~ 72.5kg | +7.5kg'
            values={mockProgress.map((point) => point.bestWeightKg)}
            unit='PRESS BANCA'
          />
          <TrainingChart
            title='ADHERENCIA'
            summary='74% ~ 100% | 91%'
            values={[
              82,
              88,
              74,
              100,
              91,
              96,
              84,
              94,
            ]}
            unit='ÚLTIMAS 8'
          />
          <TrainingChart
            title='SERIES HECHAS'
            summary='12 ~ 24 | 18'
            values={[
              18,
              16,
              19,
              12,
              21,
              17,
              23,
              15,
              18,
              24,
              14,
              20,
            ]}
            bar
          />
        </View>

        <View className='mt-4 flex-row gap-3'>
          <View className='flex-1 rounded-3xl border border-border-soft bg-surface-muted p-5'>
            <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-subtle'>
              MEJOR PESO
            </Text>
            <Text className='mt-2 font-geist-mono-semibold text-2xl tracking-[-1px] text-surface-dark'>
              72.5 kg
            </Text>
          </View>
          <View className='flex-1 rounded-3xl bg-surface-muted p-5'>
            <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-muted'>
              ADHERENCIA
            </Text>
            <Text className='mt-2 font-geist-mono-semibold text-2xl tracking-[-1px] text-surface-dark'>
              91%
            </Text>
          </View>
        </View>
      </ScrollView>
    </GymScreen>
  )
}
