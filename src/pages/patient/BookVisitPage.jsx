import { useState } from "react";
import {
  Box, Button, Flex, Grid, HStack, Heading, Spinner, Text, VStack,
} from "@chakra-ui/react";
import {
  useGetCliniciansQuery, useGetWeeklyAvailabilityQuery,
  useGetAvailableSlotsQuery, useBookAppointmentMutation,
} from "../../features/api/careSlotApi";
import Toast, { useToastMsg } from "../../components/common/Toast";
import BookingModal from "../../components/patient/BookingModal"; 
import { DAY_NAMES, nextDatesForWeekday, fmtDate, fmtTime, combineToISOWithOffset } from "../../utils/dates";

const CARD_SHADOW = "0 2px 12px rgba(62, 39, 35, 0.06)";
const initialsOf = (c) => `${c.firstName?.[0] || ""}${c.lastName?.[0] || ""}`.toUpperCase();

export default function BookVisitPage() {
  const [selected, setSelected] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [bookingSlot, setBookingSlot] = useState(null);
  const [modalError, setModalError] = useState(null);
  
  const { message, show } = useToastMsg();

  const { data: clinicians = [], isLoading } = useGetCliniciansQuery();
  const { data: weekly = [] } = useGetWeeklyAvailabilityQuery(selected?.userId, { skip: !selected });
  const { data: slots = [], isFetching } = useGetAvailableSlotsQuery(
    { clinicianId: selected?.userId, date: selectedDate },
    { skip: !selected || !selectedDate }
  );
  const [book, { isLoading: isBooking }] = useBookAppointmentMutation();

  
  const handleOpenModal = (slot) => {
    setBookingSlot(slot);
    setModalError(null); 
  };

  const handleCloseModal = () => {
    setBookingSlot(null);
    setModalError(null);
  };

  const handleConfirmBooking = async ({ reason }) => {
    setModalError(null);
    try {
      const startIso = combineToISOWithOffset(selectedDate, bookingSlot.startTime);
      const endIso = combineToISOWithOffset(selectedDate, bookingSlot.endTime);
      await book({
        clinicianId: selected.userId,
        date: selectedDate,
        startTime: startIso,
        endTime: endIso,
        reason,
      }).unwrap();
      

      return true; 
    } catch (e) {
      const errMsg = e?.data?.message || "This slot was just taken.";
      setModalError(errMsg);
      throw e; 
    }
  };

  const resetSelection = () => {
    setSelected(null);
    setSelectedDay(null);
    setSelectedDate(null);
  };

  if (!selected) {
    return (
      <Box  mx="auto" py={4}>
        <VStack align="start" spacing={1} mb={6}>
          <Text fontSize={{base: "8px", md: "12px"}} fontWeight={600} color="#5D4037" textTransform="uppercase" letterSpacing="0.08em">
            Browse
          </Text>
          <Heading fontSize={{base: "24px", md: "30px"}} fontWeight={800} color="espresso" letterSpacing="-0.5px">
            Find a Clinician
          </Heading>
        </VStack>

        {isLoading ? (
          <Flex justify="center" py={16}><Spinner size="xl" color="brand.500" thickness="3px" /></Flex>
        ) : (
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} w="100%" gap={6}>
            {clinicians.map((c) => (
              <Box
                key={c.userId}
                bg="beige" borderRadius="20px" p={6} boxShadow={CARD_SHADOW}
                cursor="pointer" transition="all 0.2s"
                _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 28px rgba(62,39,35,0.12)" }}
                onClick={() => { setSelected(c); setSelectedDay(null); setSelectedDate(null); }}
              >
                <HStack align="start" spacing={4} mb={{base:2, md: 4}}>
                  <Flex w={{base: "40px", md: "50px"}} h={{base: "40px", md: "50px"}} borderRadius="full" bg="brand.500" align="center" justify="center" color="white" fontSize={{base:"13px",md:"16px"}} fontWeight={700} flexShrink={0}>
                    {initialsOf(c)}
                  </Flex>
                  <Box>
                    <Text fontSize={{ base: "13px", md: "17px" }} fontWeight={700} color="espresso">
                      Dr. {c.firstName} {c.lastName}
                    </Text>
                    <Text fontSize={{base: "11px", md: "13px"}} color="brand.500" fontWeight={500}>
                      {c.specialty}
                    </Text>
                  </Box>
                </HStack>
                <Flex justify="space-between" align="center">
                  <Text fontSize={{base: "11px", md: "13px"}} color="#5D4037">View weekly hours</Text>
                  <Button size="sm" fontSize={{base: "11px", md: "13px"}} variant="primary" onClick={(e) => { e.stopPropagation(); setSelected(c); }}>
                    Book Now
                  </Button>
                </Flex>
              </Box>
            ))}
          </Grid>
        )}
      </Box>
    );
  }

  return (
    <Box  mx="auto" py={4}>
      <Button onClick={resetSelection} mb={6} size="sm" bg="transparent" color="brand.500" border="1.5px solid" borderColor="brand.500" borderRadius="full" fontWeight={600} _hover={{ bg: "beige" }}>
        ← Back to Clinicians
      </Button>

      <Flex bg="beige" borderRadius="20px" p={6} boxShadow={CARD_SHADOW} gap={6} mb={4} direction={{ base: "column", sm: "row" }} align={{ base: "flex-start", sm: "center" }}>
        <Flex w="76px" h="76px" borderRadius="full" bg="brand.500" align="center" justify="center" color="white" fontSize="22px" fontWeight={700} flexShrink={0}>
          {initialsOf(selected)}
        </Flex>
        <Box flex={1}>
          <Text fontSize="18px" fontWeight={700} color="espresso">Dr. {selected.firstName} {selected.lastName}</Text>
          <Text color="brand.500" fontWeight={600} fontSize="14px" mb={1.5}>{selected.specialty}</Text>
          <Text fontSize="13px" color="#5D4037">Pick a day below, then choose a date and time slot.</Text>
        </Box>
      </Flex>

      <Box bg="beige" borderRadius="20px" p={6} boxShadow={CARD_SHADOW} mb={4}>
        <Text fontSize="18px" fontWeight={700} color="espresso" mb={4}>Weekly Availability</Text>
        <Flex gap={2} flexWrap="wrap">
          {DAY_NAMES.map((day, i) => {
            const av = weekly.find((w) => w.dayOfWeek === i + 1);
            const sel = selectedDay === i + 1;
            return (
              <Box key={day} flex="1" minW="72px" textAlign="center">
                <Text fontSize="11px" fontWeight={600} color="#5D4037" mb={2}>{day}</Text>
                <Button
                  w="100%" minH="48px" h="auto" borderRadius="12px" border="none" py={1.5}
                  bg={sel ? "brand.500" : av ? "rgba(160,120,85,0.1)" : "rgba(215,204,200,0.3)"}
                  color={sel ? "white" : av ? "brand.500" : "taupe"}
                  fontSize="11.5px" fontWeight={600}
                  isDisabled={!av} _disabled={{ opacity: 1, cursor: "not-allowed" }}
                  _hover={{ bg: sel ? "brand.600" : av ? "rgba(160,120,85,0.18)" : "rgba(215,204,200,0.3)" }}
                  onClick={() => { setSelectedDay(sel ? null : i + 1); setSelectedDate(null); }}
                >
                  {av ? `${av.startTime.slice(0, 5)}–${av.endTime.slice(0, 5)}` : "—"}
                </Button>
              </Box>
            );
          })}
        </Flex>
      </Box>

      {selectedDay && (
        <Box bg="beige" borderRadius="20px" p={6} boxShadow={CARD_SHADOW} mb={4}>
          <Text fontSize="18px" fontWeight={700} color="espresso" mb={4}>Choose a Date — {DAY_NAMES[selectedDay - 1]}</Text>
          <Flex gap={2} flexWrap="wrap">
            {nextDatesForWeekday(selectedDay).map((iso) => (
              <Button
                key={iso} onClick={() => setSelectedDate(iso)} size="sm" borderRadius="full" fontWeight={600} fontSize="13px"
                bg={selectedDate === iso ? "brand.500" : "transparent"}
                color={selectedDate === iso ? "white" : "brand.500"}
                border={selectedDate === iso ? "none" : "1.5px solid"} borderColor="brand.500"
                _hover={{ bg: selectedDate === iso ? "brand.600" : "rgba(160,120,85,0.1)" }}
              >
                {fmtDate(iso)}
              </Button>
            ))}
          </Flex>
        </Box>
      )}

      {selectedDate && (
        <Box bg="beige" borderRadius="20px" p={6} boxShadow={CARD_SHADOW}>
          <Text fontSize="18px" fontWeight={700} color="espresso" mb={4}>Available Slots — {fmtDate(selectedDate)}</Text>
          {isFetching ? (
            <Spinner color="brand.500" />
          ) : slots.length === 0 ? (
            <Text fontSize="14px" color="#5D4037">No open slots on this date. Try another day.</Text>
          ) : (
            <Flex flexWrap="wrap" gap={2}>
              {slots.map((s) => (
                <Button
                  key={s.startTime} onClick={() => handleOpenModal(s)} size="sm"
                  bg="transparent" border="1.5px solid" borderColor="brand.500" color="brand.500"
                  borderRadius="full" fontWeight={600} fontSize="13px"
                  _hover={{ bg: "brand.500", color: "white" }}
                >
                  {fmtTime(s.startTime)}
                </Button>
              ))}
            </Flex>
          )}
        </Box>
      )}

      <BookingModal
        isOpen={!!bookingSlot}
        slot={bookingSlot}
        date={selectedDate}
        clinician={selected}
        onClose={handleCloseModal}
        onConfirm={handleConfirmBooking}
        isBooking={isBooking}
        error={modalError}
      />

      <Toast message={message} />
    </Box>
  );
}