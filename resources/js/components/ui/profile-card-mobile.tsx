import React, { useMemo } from 'react';
import '../../../css/profile-card-mobile.css';

interface ProfileCardMobileProps {
  avatarUrl: string;
 name?: string;
 title?: string;
 handle?: string;
 status?: string;
  contactText?: string;
  className?: string;
  onContactClick?: () => void;
}

const ProfileCardMobile: React.FC<ProfileCardMobileProps> = ({
  avatarUrl,
  name = 'User Name',
  title = 'Job Title',
  handle = 'username',
  status = 'Online',
  contactText = 'Contact',
  className = '',
  onContactClick
}) => {
  const cardStyle = useMemo(() => ({
    backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(56, 142, 60, 0.1), rgba(25, 25, 25, 0.2)), linear-gradient(145deg, rgba(34, 34, 0.2) 0%, rgba(10, 10, 10, 0.2) 100%)',
  }), []);

  const handleContactClick = () => {
    onContactClick?.();
  };

  return (
    <div className={`pc-mobile-card-wrapper ${className}`.trim()}>
      <div className="pc-mobile-card" style={cardStyle}>
        <div className="pc-mobile-content">
          <div className="pc-mobile-avatar-section">
            <img
              className="pc-mobile-avatar"
              src={avatarUrl}
              alt={`${name || 'User'} avatar`}
              loading="lazy"
              onError={e => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          
          <div className="pc-mobile-details">
            <h3 className="pc-mobile-name">{name}</h3>
            {/* {title && <p className="pc-mobile-title">{title}</p>} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardMobile;