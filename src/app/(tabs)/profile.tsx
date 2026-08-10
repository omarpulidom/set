import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { StarRating } from "@/components/Elements/StarRating";
import { Colors } from "@/components/colors";

export default function ProfileTab() {
  const [ticketRenderSize, setTicketRenderSize] = useState({ width: 0 });

  const sizes = {
    photo: {
      width: ticketRenderSize.width * 0.29,
      height: ticketRenderSize.width * 0.61,
    },
    title: ticketRenderSize.width * 0.22,
    label: ticketRenderSize.width * 0.03,
    content: ticketRenderSize.width * 0.026,
    gap: ticketRenderSize.width * 0.023,
    barcode: ticketRenderSize.width * 0.1,
    watermark: ticketRenderSize.width * 0.04,
    edge: ticketRenderSize.width * 0.021,
  };

  return (
    <SafeAreaView className="flex-1 items-center p-8 bg-gray-50">
      <View
        className="w-full bg-surface-muted"
        onLayout={(e) => {
          setTicketRenderSize({
            width: e.nativeEvent.layout.width,
          });
        }}
      >
        <View className="flex-row">
          {Array.from({ length: 24 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: sizes.edge,
                borderRightWidth: sizes.edge,
                borderTopWidth: sizes.edge * 0.75,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: Colors.surface.card,
              }}
            />
          ))}
        </View>
        <View
          className="flex-row overflow-hidden"
          style={{
            paddingHorizontal: sizes.gap * 0.57,
            paddingVertical: sizes.gap * 1.5,
          }}
        >
          {/* Watermark */}
          <View
            style={{
              width: sizes.watermark,
              marginVertical: -sizes.gap * 4,
            }}
          >
            <View
              style={{ marginHorizontal: -sizes.gap * 5, gap: sizes.gap * 12 }}
            >
              <Text
                style={{
                  transform: [{ rotate: "-90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
              <Text
                style={{
                  transform: [{ rotate: "-90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
              <Text
                style={{
                  transform: [{ rotate: "-90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
              <Text
                style={{
                  transform: [{ rotate: "-90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
              <Text
                style={{
                  transform: [{ rotate: "-90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
              <Text
                style={{
                  transform: [{ rotate: "-90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
            </View>
          </View>
          {/* Info */}
          <View
            className="flex-1"
            style={{ paddingHorizontal: sizes.gap * 2.3 }}
          >
            {/* Label */}
            <Text
              className="font-salbabida text-center text-legacy-ticketHeading leading-none"
              style={{ fontSize: sizes.title, marginTop: sizes.gap * 0.5 }}
            >
              SET
            </Text>
            {/* Data */}
            <View
              style={{
                gap: sizes.gap * 0.75,
                marginBottom: sizes.gap * 3.5,
                marginTop: sizes.gap * 1.2,
              }}
            >
              <Text
                className="font-merchant text-center text-legacy-ticket"
                style={{ fontSize: sizes.label }}
              >
                ORDEN:#23
              </Text>
              <Text
                className="font-merchant text-center text-legacy-ticket"
                style={{ fontSize: sizes.content }}
              >
                JULIO 2, 2026
              </Text>
              <Text
                className="font-merchant text-center text-ink-muted"
                style={{ fontSize: sizes.content }}
              >
                RESUMEN DIARIO
              </Text>
            </View>
            {/* Table */}
            <View style={{ position: "relative" }}>
              {/* Separator */}
              <Text
                className="font-merchant text-center text-legacy-ticketDivider"
                style={{
                  fontSize: sizes.content,
                  position: "absolute",
                  alignSelf: "center",
                  top: sizes.gap * 2.14,
                  marginHorizontal: -sizes.gap,
                }}
              >
                *******************************************
              </Text>
              {/* Table */}
              <View className="w-full flex-row justify-between">
                {/* Column 1 */}
                <View style={{ gap: sizes.gap * 3.14 }}>
                  {/* Label */}
                  <Text
                    className="font-merchant text-legacy-ticket"
                    style={{ fontSize: sizes.label }}
                  >
                    ACTIVIDAD
                  </Text>
                  {/* List */}
                  <View style={{ gap: sizes.gap }}>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      GYM
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      LECTURA
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      AGUA 2L
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      MEDITAR
                    </Text>
                    <View style={{ height: sizes.content }} />
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      CORRER
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      PROGRAMAR
                    </Text>
                  </View>
                </View>
                {/* Column 2 */}
                <View style={{ gap: sizes.gap * 3.14 }}>
                  {/* Label */}
                  <Text
                    className="font-merchant text-legacy-ticket"
                    style={{ fontSize: sizes.label }}
                  >
                    ESTATUS
                  </Text>
                  {/* List */}
                  <View style={{ gap: sizes.gap }}>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      OK
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      OK
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      OK
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      OK
                    </Text>
                    <View style={{ height: sizes.content }} />
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      PENDIENTE
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      PENDIENTE
                    </Text>
                  </View>
                </View>
                {/* Column 3 */}
                <View style={{ gap: sizes.gap * 3.14 }}>
                  {/* Label */}
                  <Text
                    className="font-merchant text-legacy-ticket"
                    style={{ fontSize: sizes.label }}
                  >
                    HORA
                  </Text>
                  {/* List */}
                  <View style={{ gap: sizes.gap, alignItems: "center" }}>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      12:24
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      19:56
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      20:12
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      14:31
                    </Text>
                    <View style={{ height: sizes.content }} />
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      -
                    </Text>
                    <Text
                      className="font-merchant text-legacy-ticket"
                      style={{ fontSize: sizes.content }}
                    >
                      -
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Separator */}
            <Text
              className="font-merchant text-center text-legacy-ticketDivider"
              style={{
                fontSize: sizes.content,
                alignSelf: "center",
                marginTop: sizes.gap * 3.14,
                marginHorizontal: -sizes.gap,
              }}
            >
              *******************************************
            </Text>
            {/* Price info */}
            <View
              style={{
                marginTop: sizes.gap,
                marginBottom: sizes.gap * 1.28,
              }}
            >
              <View
                className="flex-row justify-between"
                style={{ marginBottom: sizes.gap * 1.28 }}
              >
                <Text
                  className="font-merchant text-legacy-ticket"
                  style={{ fontSize: sizes.content }}
                >
                  SUBTOTAL
                </Text>
                <Text
                  className="font-merchant text-legacy-ticket"
                  style={{ fontSize: sizes.content }}
                >
                  6
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text
                  className="font-merchant text-legacy-ticket"
                  style={{
                    fontSize: sizes.content,
                    marginBottom: sizes.gap * 2.28,
                  }}
                >
                  DESCUENTO
                </Text>
                <Text
                  className="font-merchant text-legacy-ticket"
                  style={{ fontSize: sizes.content }}
                >
                  -2
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text
                  className="font-merchant text-legacy-ticket"
                  style={{ fontSize: sizes.label }}
                >
                  TOTAL
                </Text>
                <Text
                  className="font-merchant text-legacy-ticket"
                  style={{ fontSize: sizes.label }}
                >
                  4/6
                </Text>
              </View>
            </View>
            {/* Rating */}
            <View className="self-center">
              <StarRating
                percentage={0.7}
                size={sizes.label * 1.33}
                color={Colors.legacy.ticket}
              />
            </View>
            <Text
              className="font-merchant text-center text-legacy-ticket"
              style={{
                fontSize: sizes.label,
                marginVertical: sizes.gap * 1.28,
              }}
            >
              ************ DIA CERRADO ************
            </Text>
            <View className="flex-row justify-between">
              <Text
                className="font-merchant text-legacy-ticket"
                style={{ fontSize: sizes.content }}
              >
                Jueves 2 @ 02:12 AM
              </Text>
              <Text
                className="font-merchant text-legacy-ticket"
                style={{ fontSize: sizes.content }}
              >
                @OMARPM
              </Text>
            </View>
            <Text
              className="font-barcode-39 text-center text-legacy-ticket"
              style={{
                fontSize: sizes.barcode,
                marginTop: sizes.gap * 0.75,
                marginBottom: -sizes.gap,
              }}
            >
              1111111111111111
            </Text>
            <Text
              className="font-merchant text-center text-legacy-ticket"
              style={{ fontSize: sizes.content }}
            >
              Gracias por usar SET!
            </Text>
            <Text
              className="font-merchant text-center text-ink-muted"
              style={{ fontSize: sizes.content, marginTop: sizes.gap * 1.75 }}
            >
              Todo lo que repites, te convierte.
            </Text>
          </View>
          {/* Watermark */}
          <View
            style={{
              width: sizes.watermark,
              marginVertical: sizes.gap * 1.68,
            }}
          >
            <View
              style={{ marginHorizontal: -sizes.gap * 5, gap: sizes.gap * 12 }}
            >
              <Text
                style={{
                  transform: [{ rotate: "90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
              <Text
                style={{
                  transform: [{ rotate: "90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
              <Text
                style={{
                  transform: [{ rotate: "90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
              <Text
                style={{
                  transform: [{ rotate: "90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
              <Text
                style={{
                  transform: [{ rotate: "90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
              <Text
                style={{
                  transform: [{ rotate: "90deg" }],
                  fontSize: sizes.watermark,
                  height: sizes.watermark * 1,
                }}
                className="leading-none font-geist-mono-semibold text-legacy-ticketAccent"
              >
                SET
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row">
          {Array.from({ length: 24 }).map((_, i) => (
            <View
              key={i}
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: sizes.edge,
                borderRightWidth: sizes.edge,
                borderTopWidth: sizes.edge * 0.75,
                borderLeftColor: Colors.surface.card,
                borderRightColor: Colors.surface.card,
                borderTopColor: "transparent",
              }}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
