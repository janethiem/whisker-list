import type { ImgHTMLAttributes } from 'react';

// Import icons directly
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

type SemanticIconName = keyof typeof iconMap;

interface IconProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  name: IconName | SemanticIconName;
  size?: number;
  className?: string;
}

const Icon = ({ name, size = 24, className = '', ...props }: IconProps) => {
  const iconKey = (iconMap[name as SemanticIconName] || name) as IconName;
  const iconSrc = iconAssets[iconKey];

  if (!iconSrc) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <div
      className={`inline-block ${className}`}
      style={{ 
        width: size, 
        height: size,
        position: 'relative',
        overflow: 'hidden',
      }}
      {...props}
    >
      <img
        src={iconSrc}
        alt={`${name} icon`}
        style={{
          width: '300%', // Much bigger to crop more whitespace
          height: '300%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'contain',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  );
};

export default Icon;
