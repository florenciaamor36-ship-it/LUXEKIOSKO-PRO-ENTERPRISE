
import React from 'react';
import { Sale } from '../types';
import { Clock, Tag, CreditCard, Banknote, Landmark, ExternalLink } from 'lucide-react';

interface SalesHistoryProps {
  sales: Sale[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales }) => {
  const sortedSales = [...sales].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getPaymentIcon = (method: Sale['paymentMethod']) => {
    switch(method) {
      case 'cash': return <Banknote size={16} className="text-green-600" />;
      case 'card': return <CreditCard size={16} className="text-blue-600" />;
      case 'transfer': return <Landmark size={16} className="text-purple-600" />;
    }
  };

  const getPaymentLabel = (method: Sale['paymentMethod']) => {
    switch(method) {
      case 'cash': return 'Efectivo';
      case 'card': return 'Tarjeta';
      case 'transfer': return 'Transferencia';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Historial de Ventas</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Fecha y Hora</th>
                <th className="px-6 py-4">Productos</th>
                <th className="px-6 py-4">Método de Pago</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedSales.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">{sale.timestamp.toLocaleDateString()}</p>
                        <p className="text-xs text-gray-400">{sale.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {sale.items.slice(0, 2).map((item, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                      {sale.items.length > 2 && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                          +{sale.items.length - 2} más
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(sale.paymentMethod)}
                      <span className="text-xs font-medium">{getPaymentLabel(sale.paymentMethod)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-800">${sale.total.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400">
                    Aún no se han registrado ventas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
