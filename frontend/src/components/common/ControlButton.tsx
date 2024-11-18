import { Button } from "@nextui-org/react";

interface ControlButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function ControlButton({
  text,
  onClick,
  disabled,
}: ControlButtonProps) {

  return (
    <Button
      onClick={() => onClick()}
      isDisabled={disabled}
      size="md"
      className="bg-secondary text-black shadow-outer-shadow border-t border-2 border-gray-200"
    >
      {text}
    </Button>
  );
}
