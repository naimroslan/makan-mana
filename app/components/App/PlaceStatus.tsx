import Badge from "~/components/Badge/Badge";

type PlaceStatusProps = {
  isOpen: boolean;
};

export default function PlaceStatus({ isOpen }: PlaceStatusProps) {
  return isOpen ? (
    <Badge label="Open" bgColor="bg-green-500" textColor="text-white" />
  ) : (
    <Badge label="Closed" bgColor="bg-red-500" textColor="text-white" />
  );
}
