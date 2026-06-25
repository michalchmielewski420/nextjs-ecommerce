'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { updateOrderStatusAction, deleteOrderAction } from '@/app/actions/order-admin';

interface AdminOrderCardProps {
  order: {
    id: string;
    items: string;
    total: number;
    status: string;
    createdAt: Date | string;
  };
}

export default function AdminOrderCard({ order }: AdminOrderCardProps) {
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const parsedItems = order.items.split(',').map(item => item.trim()).filter(Boolean);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    setStatus(newStatus);
    
    const res = await updateOrderStatusAction(order.id, newStatus);
    if (res.success) {
      toast.success(`Zmieniono status zamówienia na: ${newStatus}`, { id: `status-${order.id}` });
    } else {
      toast.error(res.error || 'Wystąpił błąd');
      setStatus(order.status); // Przywróć poprzedni stan w razie błędu
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz bezpowrotnie usunąć to zamówienie z bazy danych?')) return;

    const loadingToast = toast.loading('Usuwanie zamówienia...');
    const res = await deleteOrderAction(order.id);
    
    toast.dismiss(loadingToast);
    if (res.success) {
      toast.success('Zamówienie zostało usunięte');
    } else {
      toast.error(res.error || 'Nie udało się usunąć zamówienia');
    }
  };

  // Kolory tła dla różnych statusów, żeby od razu rzucały się w oczy
  const getStatusStyle = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Opłacone':
      case 'Zrealizowano':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Wysłane':
      case 'W dostawie':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Anulowane':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden hover:border-gray-200 transition-colors">
      
      {/* Belka górna zamówienia */}
      <div className="bg-gray-50/70 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-gray-200/60 text-gray-600 px-2 py-1 rounded-md font-bold">
            #{order.id.slice(-8).toUpperCase()}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleString('pl-PL')}
          </span>
        </div>
        
        {/* Zarządzanie statusem oraz usuwanie */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className={`text-xs font-extrabold px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer transition-colors ${getStatusStyle(status)}`}
          >
            <option value="Opłacone">Opłacone 💳</option>
            <option value="Wysłane">Wysłane 📦</option>
            <option value="W dostawie">W dostawie 🚚</option>
            <option value="Zrealizowano">Zrealizowano ✓</option>
            <option value="Anulowane">Anulowane ❌</option>
          </select>

          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all cursor-pointer"
            title="Usuń zamówienie"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Zawartość zamówienia */}
      <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1 space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Zakupione produkty:</p>
          <ul className="space-y-1.5">
            {parsedItems.map((productText, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                <span className="text-blue-500">📦</span>
                {productText}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:text-right border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8 flex-shrink-0 flex justify-between md:block">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kwota zamówienia</p>
          <p className="text-xl font-black text-gray-950 mt-1">
            {(order.total / 100).toFixed(2)} <span className="text-xs font-normal text-gray-500">PLN</span>
          </p>
        </div>
      </div>

    </div>
  );
}