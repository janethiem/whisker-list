import type { ImgHTMLAttributes } from 'react';

import pawPrintIcon from '../../assets/icons/paw-print.png';
import yarnBallIcon from '../../assets/icons/yarn-ball.png';
import catClipboardIcon from '../../assets/icons/cat-clipboard.png';
import sleepingCatIcon from '../../assets/icons/sleeping-cat.png';
import catCrossPawsIcon from '../../assets/icons/cat-cross-paws.png';
import playfulCatIcon from '../../assets/icons/playful-cat.png';
import catMagnifyingGlassIcon from '../../assets/icons/cat-magnifying-glass.png';
import catFoodBowlIcon from '../../assets/icons/cat-food-bowl.png';
import catCalendarIcon from '../../assets/icons/cat-calendar.png';
import whiskersCatFaceIcon from '../../assets/icons/whiskers-cat-face.png';

const iconAssets = {
  'paw-print': pawPrintIcon,
  'yarn-ball': yarnBallIcon,
  'cat-clipboard': catClipboardIcon,
  'sleeping-cat': sleepingCatIcon,
  'cat-cross-paws': catCrossPawsIcon,
  'playful-cat': playfulCatIcon,
  'cat-magnifying-glass': catMagnifyingGlassIcon,
  'cat-food-bowl': catFoodBowlIcon,
  'cat-calendar': catCalendarIcon,
  'whiskers-cat-face': whiskersCatFaceIcon,
} as const;

type IconName = keyof typeof iconAssets;

const iconMap = {
  add: 'paw-print',
  complete: 'yarn-ball',
  edit: 'playful-cat',
  delete: 'cat-cross-paws',
  list: 'cat-clipboard',
  search: 'cat-magnifying-glass',
  archive: 'sleeping-cat',
  category: 'cat-food-bowl',
  calendar: 'cat-calendar',
  logo: 'whiskers-cat-face',
} as const;

const tooltipMap = {
  add: 'Add',
  complete: 'Complete',
  edit: 'Edit',
  delete: 'Delete',
  list: 'List',
  search: 'Search',
  archive: 'Archive',
  category: 'Category',
  calendar: 'Calendar',
  logo: 'Logo',
} as const;

type SemanticIconName = keyof typeof iconMap;

interface IconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'title'> {
  name: IconName | SemanticIconName;
  size?: number;
  className?: string;
  tooltip?: string;
}

const Icon = ({ name, size = 24, className = '', tooltip, ...props }: IconProps) => {
  const iconKey = (iconMap[name as SemanticIconName] || name) as IconName;
  const iconSrc = iconAssets[iconKey];

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const autoTooltip = tooltipMap[name as SemanticIconName];
  const finalTooltip = tooltip || autoTooltip;

  return (
    <img
      src={iconSrc}
      alt={`${name} icon`}
      title={finalTooltip}
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: 'contain',
        backgroundColor: 'transparent',
        mixBlendMode: 'multiply',
      }}
      {...props}
    />
  );
};

export default Icon;
