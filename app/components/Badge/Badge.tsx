type BadgeProps = {
  label: string;
  bgColor?: string;
  textColor?: string;
};

export default function Badge({
  label,
  bgColor = "bg-gray-200",
  textColor = "text-gray-800",
}: BadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}
    >
      {label}
    </span>
  );
}
