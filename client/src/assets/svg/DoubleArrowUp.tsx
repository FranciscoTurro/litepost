interface DoubleArrowUpProps {
  color?: string;
}

export const DoubleArrowUp: React.FC<DoubleArrowUpProps> = ({
  color = 'white',
}) => {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={color}
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
      />
    </svg>
  );
};
