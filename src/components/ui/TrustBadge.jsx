import React from 'react';
import bronzeIcon from '../../assets/bronze_image.png';
import silverIcon from '../../assets/silver_image.png';
import goldIcon from '../../assets/gold_image.png';
import platinumIcon from '../../assets/platinum_image.png';

const TIER_CONFIG = {
  BRONZE: { icon: bronzeIcon, label: 'Bronze' , bg: 'transparent'},
  SILVER: { icon: silverIcon, label: 'Silver' },
  GOLD: { icon: goldIcon, label: 'Gold' },
  PLATINUM: { icon: platinumIcon, label: 'Platinum' },
};

export default function TrustBadge({ tier = 'BRONZE', size = 'md' }) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;

  const sizes = {
    sm: 'h-10',
    md: 'h-14', 
    lg: 'h-20',
  };

  const heightClass = sizes[size] || sizes.md;

  return (
    <div className="flex items-center justify-center w-full fallback-layout">
      <img 
    src={cfg.icon} 
    alt={`${cfg.label} Badge`} 
    className={`${heightClass} w-auto object-contain inline-block mix-blend-screen`} 
  />
    </div>
  );
}