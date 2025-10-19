import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import "@fontsource-variable/plus-jakarta-sans";

const theme = extendTheme({
    config: {
    initialColorMode: "dark",
    useSystemColorMode: false
   },
   styles: {
    global: (props: any) => ({
      html: {
        height: "100%",
        overflowX: "hidden",
      },
      config: {
      initialColorMode: "dark"
       },
      body: {
        height: "100%",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
        color: "white",
        fontFamily: "'Plus Jakarta Sans Variable', sans-serif",
        bgGradient: mode(
          "linear(to-b, #1D94F0 0%, #1D94F0 78%, #036DC5 100%)", //Mode no Light
          "linear(to-b, #1D94F0 0%, #1D94F0 78%, #036DC5 100%)" //Mode no dark (Poderíamos alterar)
        )(props),
      },
      "#root, #app": {
        height: "100%",
      },
      "input::placeholder": {
        color: "white",
      },
        fonts: {
           heading: "'Plus Jakarta Sans Variable', sans-serif",
           body: "'Plus Jakarta Sans Variable', sans-serif",
        },
    }),
  },
});

export default theme;