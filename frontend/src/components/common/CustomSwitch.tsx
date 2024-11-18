import { cn, Switch } from "@nextui-org/react";



interface CustomSwitchProps {
    label: string;
    checked: boolean;
    checkedByDefault?: boolean;
    onChange: (checked: boolean) => void;
}

export default function CustomSwitch({ label, checked, onChange, checkedByDefault = false }: CustomSwitchProps) {
    return (
        <Switch
        isSelected={checked}
        onChange={() => onChange(!checked)}
        aria-label={label}
        color="success"
        classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-md bg-content2 hover:bg-content items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent shadow-outer-shadow",
            ),
            wrapper: cn("bg-primary"),
          }}
        >
            {label}
        </Switch>
    );
};