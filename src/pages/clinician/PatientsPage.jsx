import {
  Box, Flex, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, VStack, Spinner,
} from "@chakra-ui/react";
import { useGetMyPatientsQuery } from "../../features/api/careSlotApi";
import { fmtDate } from "../../utils/dates";

const CARD_SHADOW = "0 2px 12px rgba(62, 39, 35, 0.06)";

export default function PatientsPage() {
  const { data: patients = [], isLoading } = useGetMyPatientsQuery();

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active": return { bg: "rgba(160,120,85,0.12)", color: "#A07855" };
      case "Monitoring": return { bg: "rgba(251,191,36,0.12)", color: "#92400e" };
      default: return { bg: "rgba(107,114,128,0.1)", color: "#6b7280" };
    }
  };

  return (
    <Box  mx="auto" py={4}>
      <VStack align="start" spacing={1} mb={6}>
        <Text fontSize={{base: "8px", md: "12px"}} fontWeight={600} color="#5D4037" textTransform="uppercase" letterSpacing="0.08em">
          Overview
        </Text>
        <Heading fontSize={{base: "24px", md: "30px"}} fontWeight={800} color="espresso" letterSpacing="-0.5px">
          My Patients
        </Heading>
      </VStack>

      <Box bg="beige" borderRadius="20px" p={0} boxShadow={CARD_SHADOW} overflow="hidden">
        {isLoading ? (
          <Flex justify="center" py={16}><Spinner color="brand.500" /></Flex>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  {["Patient", "Age", "Last Visit", "Care Plan", "Status"].map(col => (
                    <Th
                      key={col}
                      textAlign="left"
                      py={3}
                      px={5}
                      fontSize={{base: "9px", md: "11px"}}
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
                {patients.map((p, i) => (
                  <Tr key={p.userId} borderColor={i < patients.length - 1 ? "rgba(215,204,200,0.5)" : "transparent"}>
                    <Td py={4} px={{base: 2, md: 5}}>
                      <Flex align="center" gap={3}>
                        <Flex
                          w={{base: "24px", md: "36px"}} h={{base: "24px", md: "36px"}} borderRadius="full" bg="brand.500"
                          align="center" justify="center" color="white"
                          fontSize={{base: "10px", md: "12px"}} fontWeight={{base: 500, md: 700}} flexShrink={0}
                        >
                          {(p.firstName?.[0] || "") + (p.lastName?.[0] || "")}
                        </Flex>
                        <Text fontWeight={600} fontSize={{base: "11px", md: "14px"}} color="espresso">
                          {p.firstName} {p.lastName}
                        </Text>
                      </Flex>
                    </Td>
                    <Td py={4} px={5} fontSize={{base: "11px", md: "14px"}} color="#5D4037">
                      {new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()}
                    </Td>
                    <Td py={4} px={5} fontSize={{base: "11px", md: "13.5px"}} color="#5D4037">
                      {p.lastVisit ? fmtDate(p.lastVisit) : "—"}
                    </Td>
                    <Td py={4} px={5} fontSize={{base: "11px", md: "13.5px"}} color="#5D4037">
                      {p.activePlanTitle || "—"}
                    </Td>
                    <Td py={4} px={5}>
                      <Box
                        as="span"
                        px={{base: 1, md: 3}} py={1}
                        borderRadius="full"
                        fontSize={{base: "9px", md: "11.5px"}}
                        fontWeight={600}
                        {...getStatusStyle(p.status)}
                      >
                        {p.status}
                      </Box>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
}