import { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { ChevronRight } from "lucide-react";
import {
  useUpdateAvailabilityMutation,
  useSetAvailabilityMutation,
  useDeleteAvailabilityMutation,
  useGetMyWeeklyAvailabilityQuery,
} from "../../features/api/careSlotApi";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CARD_SHADOW = "0 2px 12px rgba(62, 39, 35, 0.06)";

export default function AvailabilityPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedDayIdx, setSelectedDayIdx] = useState(null);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const { data: availability = [], isLoading } =
    useGetMyWeeklyAvailabilityQuery();

  const [updateAvail] = useUpdateAvailabilityMutation();
  const [setAvail] = useSetAvailabilityMutation();
  const [deleteAvail] = useDeleteAvailabilityMutation();

  const getDayData = (idx) => {
    const backendDay = idx + 1;
    return availability.find((a) => a.dayOfWeek === backendDay);
  };

  const openDrawerForDay = (idx) => {
    const data = getDayData(idx);
    setSelectedDayIdx(idx);
    setStartTime(data ? data.startTime.slice(0, 5) : "09:00");
    setEndTime(data ? data.endTime.slice(0, 5) : "17:00");
    onOpen();
  };

  const handleSave = async () => {
    const dayOfWeek = selectedDayIdx + 1;
    try {
      if (getDayData(selectedDayIdx)) {
        await updateAvail({ dayOfWeek, startTime, endTime }).unwrap();
      } else {
        await setAvail({ dayOfWeek, startTime, endTime }).unwrap();
      }
      onClose();
    } catch (e) {}
  };

  const handleClearDay = async () => {
    const dayOfWeek = selectedDayIdx + 1;
    try {
      await deleteAvail(dayOfWeek).unwrap();
      onClose();
    } catch (e) {}
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
          My Availability
        </Heading>
        <Text fontSize={{ base: "11px", md: "14px" }} color="#5D4037">
          Click any day to set or edit your working hours.
        </Text>
      </VStack>

      <Box bg="beige" borderRadius="20px" p={6} boxShadow={CARD_SHADOW}>
        <Text
          fontSize={{ base: "14px", md: "18px" }}
          fontWeight={700}
          color="espresso"
          mb={4}
        >
          Weekly Schedule
        </Text>

        <VStack spacing={2} align="stretch" maxW="900px" mx="auto">
          {DAYS.map((day, idx) => {
            const data = getDayData(idx);
            const hasHours = !!data;

            return (
              <Flex
                key={day}
                align="center"
                gap={4}
                p={4}
                borderRadius="16px"
                bg="white"
                border="1px solid"
                borderColor={hasHours ? "rgba(160,120,85,0.25)" : "#D7CCC8"}
                cursor="pointer"
                _hover={{ bg: "rgba(160,120,85,0.04)" }}
                onClick={() => openDrawerForDay(idx)}
              >
                <Text
                  w="40px"
                  fontWeight={700}
                  fontSize={{ base: "12px", md: "14px" }}
                  color="espresso"
                >
                  {day}
                </Text>

                <Box flex={1}>
                  {hasHours ? (
                    <Text
                      fontSize={{ base: "11px", md: "13.5px" }}
                      color="#5D4037"
                    >
                      {data.startTime.slice(0, 5)} – {data.endTime.slice(0, 5)}
                    </Text>
                  ) : (
                    <Text
                      fontSize={{ base: "11px", md: "13.5px" }}
                      color="#D7CCC8"
                      fontStyle="italic"
                    >
                      Day off
                    </Text>
                  )}
                </Box>

                <Box
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize={{ base: "9px", md: "11.5px" }}
                  fontWeight={600}
                  bg={
                    hasHours
                      ? "rgba(160,120,85,0.12)"
                      : "rgba(107,114,128,0.08)"
                  }
                  color={hasHours ? "brand.500" : "#9ca3af"}
                >
                  {hasHours ? "Available" : "Off"}
                </Box>

                <ChevronRight size={16} color="#A07855" />
              </Flex>
            );
          })}
        </VStack>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay bg="rgba(62,39,35,0.28)" backdropFilter="blur(3px)" />
        <DrawerContent bg="cream" boxShadow="-8px 0 40px rgba(62,39,35,0.15)">
          <DrawerHeader borderBottomWidth="1px" borderColor="taupe">
            <Text
              fontSize={{ base: "9px", md: "12.5px" }}
              fontWeight={600}
              color="#5D4037"
              textTransform="uppercase"
              letterSpacing="0.08em"
              mb={1}
            >
              Edit Hours
            </Text>
            <Heading
              fontSize={{ base: "18px", md: "24px" }}
              fontWeight={800}
              color="espresso"
            >
              {selectedDayIdx !== null ? DAYS[selectedDayIdx] : ""}
            </Heading>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={6} align="stretch" pt={4}>
              <FormControl>
                <FormLabel
                  fontSize={{ base: "10px", md: "12px" }}
                  fontWeight={600}
                  color="#5D4037"
                >
                  Start Time
                </FormLabel>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  bg="white"
                  borderColor="taupe"
                  borderRadius="14px"
                  size={{ base: "sm", md: "lg" }}
                  _focus={{ borderColor: "brand.500" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize={{ base: "10px", md: "12px" }}
                  fontWeight={600}
                  color="#5D4037"
                >
                  End Time
                </FormLabel>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  bg="white"
                  borderColor="taupe"
                  borderRadius="14px"
                  size={{ base: "sm", md: "lg" }}
                  _focus={{ borderColor: "brand.500" }}
                />
              </FormControl>
            </VStack>
          </DrawerBody>

          <DrawerFooter
            borderTopWidth="1px"
            borderColor="taupe"
            flexDirection="column"
            gap={3}
            pt={6}
          >
            <Button
              w="full"
              variant="primary"
              borderRadius="full"
              onClick={handleSave}
              fontSize={{ base: "10px", md: "14px" }}
            >
              Save Hours
            </Button>
            {getDayData(selectedDayIdx) && (
              <Button
                w="full"
                bg="transparent"
                border="1.5px solid"
                borderColor="#dc2626"
                color="#dc2626"
                borderRadius="full"
                onClick={handleClearDay}
                fontSize={{ base: "10px", md: "14px" }}
              >
                Mark as Day Off
              </Button>
            )}
            <Button
              w="full"
              fontSize={{ base: "10px", md: "14px" }}
              variant="ghost"
              color="espresso"
              onClick={onClose}
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
