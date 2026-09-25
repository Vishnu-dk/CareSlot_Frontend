import { useRef } from "react";
import {
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, Button, Flex, Text,
} from "@chakra-ui/react";
import { CheckCircle, XCircle } from "lucide-react";


export default function StatusChangeDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  actionType,
  userName,
}) {
  const cancelRef = useRef();

  const isDeactivate = actionType === "DEACTIVATE";
  
  const iconColor = isDeactivate ? "#dc2626" : "#15803d";
  const bgColor = isDeactivate ? "rgba(220, 38, 38, 0.1)" : "rgba(21, 128, 61, 0.1)";
  const title = isDeactivate ? "Confirm Deactivation" : "Confirm Activation";
  const message = isDeactivate 
    ? `Are you sure you want to deactivate ${userName}? They will lose access immediately.`
    : `Are you sure you want to reactivate ${userName}? They will regain access.`;
  const buttonText = isDeactivate ? "Yes, Deactivate" : "Yes, Activate";
  const buttonBg = isDeactivate ? "#dc2626" : "#15803d";
  const buttonHover = isDeactivate ? "#b91c1c" : "#166534";

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent
          bg="cream"
          borderRadius="24px"
          borderWidth="1px"
          borderColor="taupe"
          boxShadow="0 28px 80px rgba(62,39,35,0.22)"
          maxW="400px"
        >
          <AlertDialogHeader fontSize="lg" fontWeight="bold" color="espresso" pb={4}>
            <Flex align="center" gap={2}>
              {isDeactivate ? <XCircle size={20} color={iconColor} /> : <CheckCircle size={20} color={iconColor} />}
              {title}
            </Flex>
          </AlertDialogHeader>

          <AlertDialogBody color="#5D4037" fontSize="14px">
            {message}
          </AlertDialogBody>

          <AlertDialogFooter pt={6}>
            <Button 
              ref={cancelRef} 
              onClick={onClose}
              bg="transparent"
              border="1.5px solid"
              borderColor="taupe"
              color="espresso"
              borderRadius="full"
              mr={3}
              _hover={{ bg: "beige" }}
            >
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              isLoading={isLoading}
              loadingText="Processing..."
              borderRadius="full"
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHover }}
            >
              {buttonText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}