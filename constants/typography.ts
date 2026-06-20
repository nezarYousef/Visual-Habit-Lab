import { TextStyle } from "react-native";

type FontToken = Pick<TextStyle, "fontSize" | "fontWeight" | "lineHeight">;

export const FONTS: Record<string, FontToken> = {
  display: { fontSize: 34, fontWeight: "800", lineHeight: 40 },
  h1: { fontSize: 28, fontWeight: "800", lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: "700", lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: "700", lineHeight: 24 },
  body: { fontSize: 16, fontWeight: "400", lineHeight: 23 },
  small: { fontSize: 13, fontWeight: "500", lineHeight: 18 },
  button: { fontSize: 15, fontWeight: "700", lineHeight: 20 }
};
