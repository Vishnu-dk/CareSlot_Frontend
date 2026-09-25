import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import FloatingRail from "./FloatingRail";
import MobileDock from "./MobileDock";

export default function AppLayout() {
  return (
    <Box minH="100vh" bg="cream">
      <Box px={{ base: 2, md: 5 }} py={2}>
        <TopBar />
      </Box>
      <FloatingRail />
      <MobileDock />

      <Box
        pt={5}
        pb={{ base: "130px", md: 12 }}
        pl={{ base: 4, md: "108px" }}
        pr={{ base: 4, md: 8 }}
      >
        <Box maxW="1200px" mx="auto">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
