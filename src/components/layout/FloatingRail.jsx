import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Box, VStack, Flex, Text } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUserRole } from "../../features/auth/authSlice";
import { careSlotApi } from "../../features/api/careSlotApi";
import { NAV_ITEMS } from "./navConfig";

export default function FloatingRail() {
  const [expanded, setExpanded] = useState(false);
  const role = useSelector(selectCurrentUserRole);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = NAV_ITEMS[role] || [];

  const handleLogout = () => {
    dispatch(careSlotApi.util.resetApiState());
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box
      as="nav"
      position="fixed"
      left={5}
      top="50%"
      transform="translateY(-50%)"
      zIndex={20}
      display={{ base: "none", md: "block" }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <VStack
        align="stretch"
        spacing={1.5}
        bg="rgba(252, 249, 242, 0.85)"
        backdropFilter="blur(14px)"
        border="1px solid"
        borderColor="taupe"
        borderRadius="28px"
        px={2.5}
        py={4}
        w={expanded ? "220px" : "76px"}
        transition="all 0.25s ease"
        overflow="hidden"
        boxShadow="0 2px 12px rgba(62, 39, 35, 0.06), 0 8px 28px rgba(62, 39, 35, 0.08)"
      >
        {items.map(({ label, path, icon: Icon, end, isLogout }) => {
          const renderRowContent = (isActive = false) => (
            <>
              <Flex
                align="center"
                justify="center"
                w="40px"
                h="40px"
                borderRadius="full"
                flexShrink={0}
                transition="all 0.15s ease"
                bg={isActive ? "brand.500" : "transparent"}
                color={isActive ? "white" : "espresso"}
                opacity={isActive ? 1 : 0.6}
                boxShadow={
                  isActive ? "0 0 0 4px rgba(160, 120, 85, 0.18)" : "none"
                }
              >
                <Icon size={20} />
              </Flex>

              <Text
                fontSize="13.5px"
                fontWeight={isActive ? 700 : 600}
                color={isActive ? "brand.600" : "espresso"}
                whiteSpace="nowrap"
                opacity={expanded ? 1 : 0}
                transition="opacity 0.2s ease"
              >
                {label}
              </Text>
            </>
          );

          if (isLogout) {
            return (
              <Box key={path} w="full">
                <Box h="1px" bg="taupe" mx={2} my={1.5} />

                <Flex
                  as="button"
                  onClick={handleLogout}
                  align="center"
                  w="full"
                  gap={3}
                  px={2}
                  py={1.5}
                  borderRadius="full"
                  transition="background 0.15s ease"
                  _hover={{ bg: "beige" }}
                >
                  {renderRowContent(false)}
                </Flex>
              </Box>
            );
          }

          return (
            <NavLink key={path} to={path} end={end}>
              {({ isActive }) => (
                <Flex
                  align="center"
                  gap={3}
                  px={2}
                  py={1.5}
                  borderRadius="full"
                  transition="background 0.15s ease"
                  bg={isActive ? "rgba(160, 120, 85, 0.14)" : "transparent"}
                  _hover={{
                    bg: isActive ? "rgba(160, 120, 85, 0.14)" : "beige",
                  }}
                >
                  {renderRowContent(isActive)}
                </Flex>
              )}
            </NavLink>
          );
        })}
      </VStack>
    </Box>
  );
}
