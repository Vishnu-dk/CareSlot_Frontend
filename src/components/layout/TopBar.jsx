import { Flex, Text, Box, Badge } from "@chakra-ui/react";
import { HeartPulse } from "lucide-react";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectCurrentUserRole } from "../../features/auth/authSlice";
import { getInitials } from "../../utils/initials";

const PORTAL_LABEL = {
  PATIENT: "Patient Portal",
  CLINICIAN: "Clinician Portal",
  ADMIN: "Admin Console",
};

export default function TopBar() {
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectCurrentUserRole);

  return (
    <Flex align="center" justify="space-between" maxW="full" mx="auto" mb={{ base: 4, md: 6 }} gap={4}>
      <Flex align="center" gap={3}>
        <Flex
          align="center" justify="center"
          w={{ base: "32px", md: "42px" }} h={{ base: "32px", md: "42px" }} borderRadius="full"
          bg="espresso" color="cream" flexShrink={0}
        >
          <HeartPulse size={20} />
        </Flex>
        <Box>
          <Text fontSize={{base:"sm" ,md:"19px"}} fontWeight="800" color="espresso" letterSpacing="-0.5px" lineHeight="1.15">
            CareSlot
          </Text>
          <Text
            fontSize={{base:"8px" ,md:"10.5px"}} fontWeight="700" color="brand.500"
            textTransform="uppercase" letterSpacing="0.08em"
          >
            {PORTAL_LABEL[role] || "Portal"}
          </Text>
        </Box>
      </Flex>

      <Flex align="center" gap={3}>
        
        <Badge
          bg="rgba(160, 120, 85, 0.12)"
          color="brand.600"
          borderRadius="full"
          px={3} py={1}
          fontSize={{base:"8px" ,md:"10.5px"}} fontWeight="700"
          letterSpacing="0.08em" textTransform="uppercase"
        >
          {user?.role}
        </Badge>

        <Text fontSize="13.5px" color="#5D4037" display={{ base: "none", sm: "block" }}>
          {user?.email}
        </Text>

        <Flex
          w={{ base: "32px", md: "38px" }} h={{ base: "32px", md: "38px" }} borderRadius="full"
          bg="brand.500" color="white"
          align="center" justify="center"
          fontSize="12px" fontWeight="700" flexShrink={0}
        >
          {getInitials(user?.email)}
        </Flex>
      </Flex>
    </Flex>
  );
}