import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/components/colors";
import { mockRoutines } from "@/features/gym/mock-data";

function formatMuscles(description: string) {
  return description
    .toLowerCase()
    .replace(/,\s*|\s+y\s+/g, "|")
    .split("|")
    .map((muscle) =>
      muscle.trim().replace(/^./, (letter) => letter.toUpperCase()),
    )
    .join(" | ");
}

export default function RoutinesTab() {
  const router = useRouter();
  const [routines, setRoutines] = useState(mockRoutines);

  useFocusEffect(
    useCallback(() => {
      setRoutines([...mockRoutines]);
    }, []),
  );

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "left", "right"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        <View className="flex-row justify-end">
          <TouchableOpacity
            onPress={() => router.push("/routine/new")}
            className="h-10 w-10 items-center justify-center rounded-full bg-surface-dark"
          >
            <Feather name="plus" size={19} color={Colors.surface.card} />
          </TouchableOpacity>
        </View>

        <View className="mt-7">
          <Text className="font-geist-mono-semibold text-xl tracking-[-1px] text-surface-dark">
            Rutinas
          </Text>
          <View className="mt-4 gap-3">
            {routines.map((routine) => (
              <TouchableOpacity
                key={routine.id}
                onPress={() =>
                  router.push({
                    pathname: "/routine/[routineId]",
                    params: { routineId: routine.id },
                  })
                }
                activeOpacity={0.86}
                className="h-36 rounded-3xl bg-surface-muted p-4"
              >
                <Feather
                  name="arrow-up-right"
                  size={14}
                  color={Colors.surface.dark}
                  style={{ position: "absolute", right: 16, top: 16 }}
                />
                <View className="flex-1 flex-row">
                  <View className="flex-1 justify-end pr-3">
                    <Text className="font-geist-mono-semibold text-xl tracking-[-1px] text-surface-dark">
                      {routine.name.toUpperCase()}
                    </Text>
                    <Text
                      numberOfLines={2}
                      className="mt-1 font-geist-mono text-xs text-ink-muted"
                    >
                      {formatMuscles(routine.description)}
                    </Text>
                    <View className="mt-1 flex-row items-center">
                      <Text className="font-geist-mono text-xs text-ink-muted">
                        {routine.exercises.reduce(
                          (total, exercise) => total + exercise.targetSets,
                          0,
                        )}{" "}
                        series
                      </Text>
                      <View className="mx-2 h-1 w-1 rounded-full bg-ink-soft" />
                      <Text className="font-geist-mono text-xs text-ink-muted">
                        ~60 min
                      </Text>
                    </View>
                  </View>
                  <View className="w-2/5 justify-end border-l border-border-soft pl-3">
                    {routine.exercises.slice(0, 3).map((exercise) => (
                      <Text
                        key={exercise.id}
                        className="mb-1 font-geist-mono text-[10px] text-surface-dark"
                      >
                        {exercise.name}
                      </Text>
                    ))}
                    {routine.exercises.length > 3 ? (
                      <Text className="font-geist-mono text-xs text-ink-muted">
                        …
                      </Text>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
