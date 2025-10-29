import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface UidDisplayProps {
  uid: string | null | undefined;
  className?: string;
}

const UidDisplay = ({ uid, className = '' }: UidDisplayProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to mask the UID
  const maskUid = (uid: string | null | undefined): string => {
    if (!uid) return '-';
    if (uid.length <= 2) return uid;
    
    // Show first 2 characters and last 2 characters, mask the middle
    const start = uid.substring(0, 2);
    const end = uid.substring(uid.length - 2);
    const masked = '*'.repeat(Math.max(0, uid.length - 4));
    
    return `${start}${masked}${end}`;
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!uid) {
    return <span className={className}>-</span>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-mono break-all">
        {isVisible ? uid : maskUid(uid)}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={toggleVisibility}
        className="h-8 w-8 p-0 hover:bg-transparent"
        aria-label={isVisible ? "Hide UID" : "Show UID"}
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4 text-gray-500" />
        ) : (
          <Eye className="h-4 w-4 text-gray-500" />
        )}
      </Button>
    </div>
  );
};

export default UidDisplay;