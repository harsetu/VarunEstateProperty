import { Link, useParams } from 'react-router-dom';
import { usePropertyEditorViewModel } from '@/features/admin/viewmodel/usePropertyEditorViewModel';
import PropertyForm from '@/features/admin/ui/PropertyForm';
import { t } from '@/core/utils/i18n';

/** /admin/publish = new listing; /admin/publish/:id = edit that listing. */
export default function AdminPublish() {
  const { id } = useParams();
  const vm = usePropertyEditorViewModel(id);

  if (!vm.canEdit) return <p className="text-ash">{t('publish.needsApi')}</p>;
  if (vm.status === 'error') return <p className="text-red-600">{vm.message?.text ?? t('publish.loadFailed')}</p>;
  if (vm.notFound) {
    return <p className="text-ash">{t('publish.notFound')} <Link to="/admin/listings" className="text-gold">{t('publish.back')}</Link></p>;
  }
  return (
    <div className="rounded-2xl bg-white shadow-card p-5 lg:p-6">
      <PropertyForm vm={vm} />
    </div>
  );
}
