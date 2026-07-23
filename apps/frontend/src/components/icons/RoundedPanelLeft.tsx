type Props = {
  size: string;
  strokeWidth?: string;
  className?: string;
};
export function RoundedPanelLeft({ size, strokeWidth = "2", className = "" }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="4" ry="4" />
      <path d="M9 3v18" />
    </svg>
  );
}
