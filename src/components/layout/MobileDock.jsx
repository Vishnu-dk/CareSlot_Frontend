import { NavLink, useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUserRole } from "../../features/auth/authSlice";
import { NAV_ITEMS } from "./navConfig";
import { careSlotApi } from "../../features/api/careSlotApi";

export default function MobileDock() {
  const role = useSelector(selectCurrentUserRole);

  const items = NAV_ITEMS[role] || [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(careSlotApi.util.resetApiState());
    dispatch(logout());
    navigate("/login");
  
    };
  return (
    <Flex
      as="nav"
      display={{ base: "flex", md: "none" }}
      position="fixed" bottom={4} left="50%" transform="translateX(-50%)"
      zIndex={20}
      bg="rgba(252, 249, 242, 0.85)"
      backdropFilter="blur(14px)"
      border="1px solid" borderColor="taupe"
      borderRadius="full"
      px={4} py={2} gap={4}
      boxShadow="0 2px 12px rgba(62, 39, 35, 0.06), 0 8px 28px rgba(62, 39, 35, 0.10)"
    >
      {items.map(({ path, icon: Icon, end, isLogout }) => {
        const renderIcon = (isActive = false) => (
          <Flex
            align="center" justify="center"
            w="32px" h="32px" borderRadius="full"
            bg={isActive ? "brand.500" : "transparent"}
            color={isActive ? "white" : "espresso"}
            opacity={isActive ? 1 : 0.55}
            cursor="pointer"
            _hover={{ opacity: 0.85 }}
          >
            <Icon size={16} />
          </Flex>
        );

        if (isLogout) {
          return (
            <Box>
                                <Box w="1px" bg="taupe" mx={.2} my={1.5} />
            
            <button key={path} onClick={handleLogout} style={{ background: 'none', border: 'none', padding: 0 }}>
              {renderIcon(false)}
            </button>
            </Box>

          );
        }
        return (
          <NavLink key={path} to={path} end={end}>
            {({ isActive }) => renderIcon(isActive)}
          </NavLink>
        );
      })}
    </Flex>
  );
}
