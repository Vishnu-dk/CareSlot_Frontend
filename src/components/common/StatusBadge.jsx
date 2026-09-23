import { Badge } from "@chakra-ui/react";

const MAP = {
  BOOKED:    { bg: "rgba(160,120,85,0.12)",  color: "#A07855" },
  ACTIVE:    { bg: "rgba(160,120,85,0.12)",  color: "#A07855" },
  COMPLETED: { bg: "rgba(34,197,94,0.12)",   color: "#15803d" },
  CANCELLED: { bg: "rgba(107,114,128,0.12)", color: "#6b7280" },
  PENDING:   { bg: "rgba(107,114,128,0.12)", color: "#6b7280" },
};

export default function StatusBadge({ status }) {
  const normalizedStatus = status?.toUpperCase() || "BOOKED";
  const c = MAP[normalizedStatus] || MAP.BOOKED;
  
  const text = normalizedStatus.charAt(0) + normalizedStatus.slice(1).toLowerCase();

  return (
    <Badge
      bg={c.bg}
      color={c.color}
      px={{ base: 2, md: 2.5 }}       
      py={{ base: 0.5, md: 1 }}        
      fontSize={{ base: "10px", md: "11.5px" }} 
      fontWeight={600}
      borderRadius="full"              
      textTransform="none"            
    >
      {text}
    </Badge>
  );
}
