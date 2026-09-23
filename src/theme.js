import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: false },

  fonts: {
    heading: `'Plus Jakarta Sans', sans-serif`,
    body: `'Plus Jakarta Sans', sans-serif`,
  },

  colors: {
    cream: "#FCF9F2",     // App background
    beige: "#F3EDE0",     // Cards / surfaces
    taupe: "#D7CCC8",     // Borders / dividers
    espresso: "#3E2723",  // Text / headings
    // Brand scale built around #A07855 (needed for Chakra colorSchemes)
    brand: {
      50: "#FAF6F1",
      100: "#F3EDE0",
      200: "#E5D5C3",
      300: "#D3B99D",
      400: "#B99672",
      500: "#A07855",  // Primary
      600: "#8A6546",  // Hover
      700: "#6F5238",
      800: "#55402B",
      900: "#3E2723",
    },
  },

  styles: {
    global: {
      body: { bg: "cream", color: "espresso" },
    },
  },

  components: {
    Button: {
      baseStyle: { borderRadius: "full", fontWeight: "600" },
      variants: {
        primary: {
          bg: "brand.500",
          color: "cream",
          _hover: { bg: "brand.600" },
          _active: { bg: "brand.700" },
        },
        soft: {
          bg: "beige",
          color: "espresso",
          _hover: { bg: "taupe" },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: "cream",
            borderColor: "taupe",
            _hover: { borderColor: "brand.300" },
            _focus: { borderColor: "brand.500", boxShadow: "0 0 0 1px #A07855" },
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: "beige",
          border: "none",
          borderRadius: "2xl",
          boxShadow: "0 4px 20px rgba(62, 39, 35, 0.06)",
        },
      },
    },
  },
});

export default theme;