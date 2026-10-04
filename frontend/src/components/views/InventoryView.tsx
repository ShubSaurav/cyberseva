import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus, 
  Calendar, 
  TrendingDown,
  Layers,
  Sparkles
} from 'lucide-react';
import { InventoryItem } from '../../types';
import { api } from '../../services/api';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onRefresh: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ inventory, onRefresh }) => {
  const [items, setItems] = useState<InventoryItem[]>(inventory);

  const handleStockUpdate = async (id: string, delta: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, item.currentStock + delta);
    setItems(items.map(i => i.id === id ? { ...i, currentStock: newStock } : i));
    await api.updateInventoryStock(id, newStock);
  };

  const lowStockCount = items.filter(i => i.status === 'LOW' || i.status === 'CRITICAL').length;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header */}
      <div className="clay-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#071A52] flex items-center gap-2">
              Counter Consumables & Inventory Tracker
              {lowStockCount > 0 && (
                <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {lowStockCount} Low Stock Alerts
                </span>
              )}
            </h2>
            <p className="text-xs text-[#667085]">
              Track paper reams, toners, ink bottles & lamination pouches with predictive depletion estimates
            </p>
          </div>
        </div>
      </div>

      {/* Predictive Warning Banner */}
      <div className="clay-card p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-amber-500 text-white mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-extrabold text-xs text-amber-900 uppercase tracking-wider">
            AI Stock Run-Out Forecast:
          </h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            Based on your daily pace of <strong>312 prints</strong>:
            <br />
            • <strong>A4 Paper</strong> will last approximately <strong>3.5 days</strong> (14 reams remaining).
            <br />
            • <strong>4x6 Glossy Photo Paper</strong> is running <strong>LOW</strong> (35 sheets remaining ~ 2 days left). Reorder recommended today!
          </p>
        </div>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`clay-card p-5 space-y-4 border-t-4 ${
              item.status === 'CRITICAL' 
                ? 'border-t-red-500' 
                : item.status === 'LOW' 
                ? 'border-t-amber-500' 
                : 'border-t-emerald-500'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block">
                  {item.category.replace('_', ' ')}
                </span>
                <h3 className="font-extrabold text-sm text-[#071A52] mt-0.5">{item.name}</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                item.status === 'GOOD' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {item.status}
              </span>
            </div>

            {/* Current Stock Display & Quick Adjusters */}
            <div className="flex items-center justify-between bg-[#F8FAFF] p-3 rounded-xl border border-[#E4E7EC]">
              <div>
                <div className="text-2xl font-extrabold text-[#071A52]">
                  {item.currentStock}
                </div>
                <div className="text-[11px] text-[#667085]">{item.unit}</div>
              </div>

              {/* Adjust Stock Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStockUpdate(item.id, -1)}
                  className="w-8 h-8 rounded-lg bg-white border border-[#E4E7EC] hover:bg-gray-100 text-[#101828] font-bold flex items-center justify-center text-sm shadow-sm"
                >
                  -
                </button>
                <button
                  onClick={() => handleStockUpdate(item.id, 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-[#E4E7EC] hover:bg-gray-100 text-[#101828] font-bold flex items-center justify-center text-sm shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Estimates & Restock info */}
            <div className="flex items-center justify-between text-xs text-[#667085] pt-1 border-t border-[#E4E7EC]">
              <span className="flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                Est: ~{item.estimatedDaysLeft} days left
              </span>
              <span>Min: {item.minThreshold}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
