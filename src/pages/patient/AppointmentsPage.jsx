import { useState } from "react";
import { useGetMyAppointmentsQuery, useCancelAppointmentMutation } from "../../features/api/careSlotApi";
import StatusBadge from "../../components/common/StatusBadge";
import Toast, { useToastMsg } from "../../components/common/Toast";
import { fmtDate, fmtTime } from "../../utils/dates";


import { Box, Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";

export default function AppointmentsPage() {
  const { data: appointments = [] } = useGetMyAppointmentsQuery();
  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();
  const [tab, setTab] = useState("upcoming");
  const { message, show } = useToastMsg();

  const upcoming = appointments.filter((a) => a.status === "BOOKED");
  const past = appointments.filter((a) => a.status !== "BOOKED");
  const list = tab === "upcoming" ? upcoming : past;

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id).unwrap();
      show("Appointment cancelled");
    } catch (e) {
      show(e?.data?.message || "Could not cancel appointment");
    }
  };

  return (
    <Box  mx="auto" py={4}>
      
      <VStack align="start" spacing={1} mb={6}>
        <Text fontSize={{base: "8px", md: "12px"}} fontWeight={600} color="#5D4037" textTransform="uppercase" letterSpacing="0.08em">
          Manage
        </Text>
        <Heading fontSize={{base: "24px", md: "30px"}} fontWeight={800} color="espresso" letterSpacing="-0.5px">
          My Appointments
        </Heading>
      </VStack>

      <Flex 
        bg="beige" 
        p={1} 
        borderRadius="full" 
        gap={1} 
        mb={6} 
        display="inline-flex"
      >
        {["upcoming", "past"].map((t) => (
          <Button
            key={t}
            onClick={() => setTab(t)}
            size="sm"
            fontSize={{base:"11px", md:"13px"}}
            px={5}
            py={2}
            borderRadius="full"
            border="none"
            cursor="pointer"
            bg={tab === t ? "brand.500" : "transparent"}
            color={tab === t ? "white" : "#5D4037"}
            fontWeight={600}
            fontSize={{base: "11px", md: "13px"}}
            textTransform="capitalize"
            transition="all 0.18s"
            _hover={{ bg: tab === t ? "brand.600" : "rgba(160,120,85,0.1)" }}
          >
            {t} ({t === "upcoming" ? upcoming.length : past.length})
          </Button>
        ))}
      </Flex>

      <VStack spacing={3} align="stretch">
        
        {list.length === 0 && (
          <Box textAlign="center" py={14} color="#5D4037">
            <Text fontSize={{base: "24px", md: "42px"}} mb={3}>📅</Text>
            <Text fontWeight={600}>No {tab} appointments</Text>
          </Box>
        )}

        {list.map((a) => (
          <Flex
            key={a.id}
            bg="beige"
            borderRadius="20px"
            p={5}
            boxShadow="0 2px 12px rgba(62, 39, 35, 0.06)"
            align="center"
            gap={4}
          >
            <Flex
              w={{base: "32px", md: "48px"}}
              h={{base: "32px", md: "48px"}}
              borderRadius="14px"
              bg="rgba(160,120,85,0.12)"
              align="center"
              justify="center"
              fontSize={{base: "16px", md: "22px"}}
              flexShrink={0}
            >
              🏥
            </Flex>

            <Box flex={1}>
              <Text fontWeight={700} fontSize={{base: "13px", md: "15px"}} color="espresso">
                {a.reason || "General consultation"}
              </Text>
              <Text fontSize={{base: "11px", md: "13px"}} color="#5D4037">
                {a.clinicianName}
              </Text>
              <Text fontSize={{base: "10px", md: "13px"}} color="#5D4037" mt={1}>
                {fmtDate(a.startsAt.slice(0, 10))} at {fmtTime(a.startsAt.slice(11, 16))}
              </Text>
            </Box>

            <VStack align="end" spacing={2}>
              <StatusBadge status={a.status} />
              
              {a.status === "BOOKED" && (
                <Button
                  size={{base: "10px", md: "sm"}}
                  bg="transparent"
                  border="1.5px solid"
                  borderColor="#dc2626"
                  color="#dc2626"
                  borderRadius="full"
                  fontWeight={600}
                  fontSize={{base: "10px", md: "12.5px"}}
                  px={{base: 2, md: 4}}
                  onClick={() => handleCancel(a.id)}
                  isLoading={isCancelling}
                  loadingText="…"
                  _hover={{ bg: "rgba(220, 38, 38, 0.06)" }}
                >
                  Cancel
                </Button>
              )}
            </VStack>
          </Flex>
        ))}
      </VStack>

      <Toast message={message} />
    </Box>
  );
}