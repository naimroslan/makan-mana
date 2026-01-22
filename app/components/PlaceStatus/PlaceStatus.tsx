import { useTheme } from "@emotion/react";
import Badge from "@Components/Badge/Badge";
import type { PlaceStatusProps } from "@Types/components/PlaceStatus.type";

const PlaceStatus = ({ isOpen }: PlaceStatusProps) => {
  const theme = useTheme();

  return isOpen ? (
    <Badge label="Open" bgColor="#22c55e" textColor={theme.colors.white[0]} />
  ) : (
    <Badge
      label="Closed"
      bgColor={theme.colors.primary}
      textColor={theme.colors.white[0]}
    />
  );
};

export default PlaceStatus;
