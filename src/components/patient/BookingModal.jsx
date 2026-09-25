import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { fmtDate, fmtTime } from "../../utils/dates";

export default function BookingModal({
  isOpen,
  slot,
  date,
  clinician,
  onClose,
  onConfirm,
  isBooking,
  error,
}) {
  const [reason, setReason] = useState("General consultation");
  const [confirmed, setConfirmed] = useState(false);

  useState(() => {
    if (!isOpen) {
      setReason("General consultation");
      setConfirmed(false);
    }
  }, [isOpen]);

  const handleConfirmClick = async () => {
    try {
      await onConfirm({ reason });
      setConfirmed(true);

      setTimeout(() => {
        onClose();
        setConfirmed(false);
        setReason("General consultation");
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  };

  if (!slot || !clinician) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={!isBooking ? onClose : undefined}
      isCentered
      closeOnOverlayClick={!isBooking}
      preserveScrollBarGap={true}
      blockScrollOnMount={true}
    >
      <ModalOverlay bg="rgba(62,39,35,0.42)" backdropFilter="blur(5px)" />

      <ModalContent
        bg="cream"
        borderRadius="24px"
        maxW="440px"
        boxShadow="0 28px 80px rgba(62,39,35,0.22)"
      >
        <ModalBody p={8}>
          {confirmed ? (
            <VStack spacing={2} textAlign="center" py={4}>
              <Flex
                w="60px"
                h="60px"
                borderRadius="full"
                bg="rgba(34,197,94,0.15)"
                align="center"
                justify="center"
                fontSize="26px"
                color="#15803d"
              >
                ✓
              </Flex>
              <Text fontSize="20px" fontWeight={700} color="espresso">
                Booking Confirmed!
              </Text>
              <Text fontSize="14px" color="#5D4037">
                Your appointment has been scheduled.
              </Text>
            </VStack>
          ) : (
            <>
              <Text fontSize="20px" fontWeight={700} color="espresso" mb={1}>
                Confirm Booking
              </Text>
              <Text fontSize="14px" color="#5D4037" mb={6}>
                Review your appointment details below
              </Text>

              <Box bg="beige" borderRadius="16px" p={5} mb={4}>
                <Text
                  fontWeight={700}
                  fontSize="15px"
                  color="espresso"
                  mb={0.5}
                >
                  Dr. {clinician.firstName} {clinician.lastName}
                </Text>
                <Text fontSize="13px" color="#5D4037">
                  {clinician.specialty}
                </Text>

                <Box mt={3} pt={3} borderTop="1px solid" borderColor="taupe">
                  <Text fontWeight={600} fontSize="14px" color="espresso">
                    {fmtDate(date)} · {fmtTime(slot.startTime)}
                  </Text>
                  <Text fontSize="12px" color="#5D4037" mt={1}>
                    30-minute consultation
                  </Text>
                </Box>
              </Box>

              <Box mb={4}>
                <Text
                  as="label"
                  display="block"
                  fontSize="13px"
                  fontWeight={700}
                  color="espresso"
                  mb={2}
                >
                  Reason for Appointment
                </Text>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Annual checkup, back pain..."
                  bg="white"
                  borderColor="brand.500"
                  color="espresso"
                  fontSize="14px"
                  borderRadius="md"
                  _focus={{
                    borderColor: "brand.600",
                    boxShadow: "0 0 0 1px #A07855",
                  }}
                  isDisabled={isBooking}
                />
              </Box>

              {error && (
                <Text color="#dc2626" fontSize="13px" fontWeight={600} mb={3}>
                  {typeof error === "string"
                    ? error
                    : error?.data?.message || "Booking failed"}
                </Text>
              )}

              <Flex gap={3}>
                <Button
                  flex={1}
                  bg="transparent"
                  border="1.5px solid"
                  borderColor="brand.500"
                  color="brand.500"
                  borderRadius="full"
                  fontWeight={600}
                  onClick={onClose}
                  isDisabled={isBooking}
                  _hover={{ bg: "beige" }}
                >
                  Cancel
                </Button>
                <Button
                  flex={1}
                  variant="primary"
                  borderRadius="full"
                  fontWeight={600}
                  onClick={handleConfirmClick}
                  isLoading={isBooking}
                  loadingText="Booking…"
                >
                  Confirm Booking
                </Button>
              </Flex>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
