import { useState, useMemo } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  VStack,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { MoreVertical, Search, UserPlus, UserMinus } from "lucide-react";
import {
  useGetAllCliniciansQuery,
  useGetAllPatientsQuery,
  useDeactivateUserMutation,
  useActivateUserMutation,
} from "../../features/api/careSlotApi";
import Toast, { useToastMsg } from "../../components/common/Toast";
import StatusChangeDialog from "../../components/admin/StatusChangeDialog";

const CARD_SHADOW = "0 2px 12px rgba(62, 39, 35, 0.06)";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const { message, show } = useToastMsg();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState("DEACTIVATE");

  const {
    data: clinicians = [],
    isLoading: loadingClinicians,
    refetch: refetchClinicians,
  } = useGetAllCliniciansQuery();
  const {
    data: patients = [],
    isLoading: loadingPatients,
    refetch: refetchPatients,
  } = useGetAllPatientsQuery();

  const [deactivateUser, { isLoading: deactivating }] =
    useDeactivateUserMutation();
  const [activateUser, { isLoading: activating }] = useActivateUserMutation();

  const isLoading = loadingClinicians || loadingPatients;
  const isProcessing = deactivating || activating;

  const allUsers = useMemo(() => {
    const cList = clinicians.map((c) => ({
      id: c.userId,
      name: `Dr. ${c.firstName} ${c.lastName}`,
      email: c.email || "N/A",
      specialty: c.specialty,
      role: "CLINICIAN",
      status: c.deletedAt ? "Inactive" : "Active",
      raw: c,
    }));

    const pList = patients.map((p) => ({
      id: p.userId,
      name: `${p.firstName} ${p.lastName}`,
      email: p.email || "N/A",
      specialty: "Patient",
      role: "PATIENT",
      status: p.deletedAt ? "Inactive" : "Active",
      raw: p,
    }));

    return [...cList, ...pList];
  }, [clinicians, patients]);

  const filteredUsers = allUsers.filter((u) => {
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const term = search.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term);
    return matchesRole && matchesSearch;
  });

  const handleToggleStatus = (user) => {
    setSelectedUser(user);
    setActionType(user.status === "Active" ? "DEACTIVATE" : "ACTIVATE");
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    try {
      if (actionType === "DEACTIVATE") {
        await deactivateUser(selectedUser.id).unwrap();
        show(`${selectedUser.role} deactivated successfully`);
      } else {
        await activateUser(selectedUser.id).unwrap();
        show(`${selectedUser.role} activated successfully`);
      }
      await Promise.all([refetchClinicians(), refetchPatients()]);

      setDialogOpen(false);
      setSelectedUser(null);
    } catch (e) {
      show(e?.data?.message || `Failed to ${actionType.toLowerCase()} user`);
      setDialogOpen(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.replace("Dr. ", "").split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  };

  const getStatusBadge = (status) => {
    if (status === "Active") {
      return { label: "Active", bg: "rgba(34,197,94,0.1)", color: "#15803d" };
    }
    return { label: "Inactive", bg: "rgba(107,114,128,0.1)", color: "#6b7280" };
  };

  return (
    <Box mx="auto" py={4}>
      <VStack align="start" spacing={1} mb={6}>
        <Text
          fontSize={{ base: "8px", md: "12px" }}
          fontWeight={600}
          color="#5D4037"
          textTransform="uppercase"
          letterSpacing="0.08em"
        >
          Manage
        </Text>
        <Heading
          fontSize={{ base: "24px", md: "30px" }}
          fontWeight={800}
          color="espresso"
          letterSpacing="-0.5px"
        >
          User Directory
        </Heading>
      </VStack>

      <Flex
        gap={4}
        mb={5}
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
      >
        <Box position="relative" flex={1} maxW="400px">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            pl={10}
            bg="white"
            borderColor="taupe"
            borderRadius="12px"
            _focus={{ borderColor: "brand.500" }}
          />
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#5D4037",
            }}
          />
        </Box>

        <Flex gap={1} bg="beige" p={1} borderRadius="12px">
          {["All", "PATIENT", "CLINICIAN"].map((f) => (
            <Button
              key={f}
              onClick={() => setRoleFilter(f)}
              size="sm"
              px={4}
              borderRadius="8px"
              border="none"
              bg={roleFilter === f ? "brand.500" : "transparent"}
              color={roleFilter === f ? "white" : "#5D4037"}
              fontWeight={600}
              fontSize="12.5px"
              _hover={{
                bg: roleFilter === f ? "brand.600" : "rgba(160,120,85,0.1)",
              }}
            >
              {f === "All" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </Button>
          ))}
        </Flex>
      </Flex>

      <Box
        bg="beige"
        borderRadius="20px"
        p={0}
        boxShadow={CARD_SHADOW}
        overflow="hidden"
      >
        {isLoading ? (
          <Flex justify="center" py={16}>
            <Spinner color="brand.500" />
          </Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  {[
                    "User",
                    "Contact Info",
                    "Specialty",
                    "Role",
                    "Status",
                    "",
                  ].map((col) => (
                    <Th
                      key={col}
                      textAlign="left"
                      py={3}
                      px={5}
                      fontSize="11px"
                      fontWeight={700}
                      color="#5D4037"
                      textTransform="uppercase"
                      letterSpacing="0.08em"
                      borderColor="taupe"
                    >
                      {col}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.length === 0 ? (
                  <Tr>
                    <Td colSpan={6} py={12} textAlign="center" color="#5D4037">
                      No users found matching "{search}"
                    </Td>
                  </Tr>
                ) : (
                  filteredUsers.map((u, i) => {
                    const statusStyle = getStatusBadge(u.status);
                    const isActive = u.status === "Active";

                    return (
                      <Tr
                        key={u.id}
                        borderColor={
                          i < filteredUsers.length - 1
                            ? "rgba(215,204,200,0.45)"
                            : "transparent"
                        }
                      >
                        <Td py={4} px={5}>
                          <Flex align="center" gap={3}>
                            <Flex
                              w="34px"
                              h="34px"
                              borderRadius="full"
                              bg={
                                isActive
                                  ? u.role === "CLINICIAN"
                                    ? "#1d4ed8"
                                    : "brand.500"
                                  : "#D7CCC8"
                              }
                              align="center"
                              justify="center"
                              color="white"
                              fontSize="11px"
                              fontWeight={700}
                              flexShrink={0}
                            >
                              {getInitials(u.name)}
                            </Flex>
                            <Text
                              fontWeight={600}
                              fontSize="14px"
                              color={isActive ? "espresso" : "#9ca3af"}
                            >
                              {u.name}
                            </Text>
                          </Flex>
                        </Td>
                        <Td py={4} px={5} fontSize="13px" color="#5D4037">
                          {u.email}
                        </Td>
                        <Td py={4} px={5} fontSize="13px" color="#5D4037">
                          {u.role === "CLINICIAN" ? u.specialty : "Patient"}
                        </Td>
                        <Td py={4} px={5}>
                          <Badge
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="11.5px"
                            fontWeight={600}
                            bg={
                              u.role === "CLINICIAN"
                                ? "rgba(59,130,246,0.1)"
                                : "rgba(160,120,85,0.1)"
                            }
                            color={
                              u.role === "CLINICIAN" ? "#1d4ed8" : "#A07855"
                            }
                          >
                            {u.role}
                          </Badge>
                        </Td>
                        <Td py={4} px={5}>
                          <Badge
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="11.5px"
                            fontWeight={600}
                            bg={statusStyle.bg}
                            color={statusStyle.color}
                          >
                            {statusStyle.label}
                          </Badge>
                        </Td>
                        <Td py={4} px={5}>
                          <Menu>
                            <MenuButton
                              as={Button}
                              variant="ghost"
                              size="sm"
                              p={2}
                              minW="auto"
                            >
                              <MoreVertical size={18} color="#5D4037" />
                            </MenuButton>
                            <MenuList
                              bg="white"
                              borderColor="taupe"
                              shadow="lg"
                              borderRadius="12px"
                              overflow="hidden"
                            >
                              <MenuItem
                                fontSize="13px"
                                color="espresso"
                                _hover={{ bg: "beige" }}
                              >
                                View Profile
                              </MenuItem>

                              {}
                              <MenuItem
                                fontSize="13px"
                                color={isActive ? "#dc2626" : "#15803d"}
                                _hover={{
                                  bg: isActive ? "red.50" : "green.50",
                                }}
                                onClick={() => handleToggleStatus(u)}
                                isDisabled={isProcessing}
                                icon={
                                  isActive ? (
                                    <UserMinus size={14} />
                                  ) : (
                                    <UserPlus size={14} />
                                  )
                                }
                              >
                                {isActive
                                  ? "Deactivate Account"
                                  : "Reactivate Account"}
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    );
                  })
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>

      <StatusChangeDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmAction}
        isLoading={isProcessing}
        actionType={actionType}
        userName={selectedUser?.name}
      />

      <Toast message={message} />
    </Box>
  );
}
