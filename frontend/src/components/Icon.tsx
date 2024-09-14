import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Spinner } from '@nextui-org/react';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  fill?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'currentColor' }) => {
  const IconComponent = useMemo(() => {
    return dynamic<SVGProps>(() => import(`@/icons/${name}Icon.svg`), {
      loading: () => <Spinner color="white" aria-label="Loading..."/>,
      ssr: false,
    });
  }, [name]);

  return <IconComponent width={size} height={size} fill={color} />;
};

export default Icon;