import { useNavigate } from 'react-router-dom';
import { t } from '@/core/utils/i18n';

/** A listing's price. "Price on request" takes the visitor to the contact page; it works inside card links too. */
export default function PriceText({ price, className = '' }: { price: string; className?: string }) {
  const navigate = useNavigate();
  if (price !== t('price.onRequest')) return <span className={className}>{price}</span>;

  const go = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/contact');
  };
  return (
    <span
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go(e)}
      className={`${className} cursor-pointer underline decoration-dotted underline-offset-4 hover:text-gold transition-colors`}
    >
      {price}
    </span>
  );
}
