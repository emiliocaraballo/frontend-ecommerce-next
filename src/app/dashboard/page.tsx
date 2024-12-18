/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useGetBestSellersQuery, useGetFrequentCustomersQuery, useGetRecentProductsQuery } from "@/src/shared/store/api";
import currencyFormat from "@/src/shared/util/currencyFormat";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


export default function DashboardPage() {
  const router = useRouter();

  // API hooks
  const { data: recentProducts = [] } = useGetRecentProductsQuery();
  const { data: bestSellers = [] } = useGetBestSellersQuery();
  const { data: frequentCustomers = [] } = useGetFrequentCustomersQuery();

  useEffect(() => {
  }, [router]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Estadisticas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Productos Recientes</h3>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <div key={product.id}>
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-gray-600">Precio: {product.price}</p>
                  </div>
                </div>
                <hr className="my-2" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Los 5 productos más vendidos</h3>
          <div className="space-y-4">
            {bestSellers.map((product) => (
              <div key={product.id}>
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-gray-600">Cantidad: {product.totalSales}</p>
                  </div>
                </div>
                <hr className="my-3" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Los 5 clientes frecuentes</h3>
          <div className="space-y-4">
            {frequentCustomers.map((customer) => (
              <div  key={customer.id}>
                <div className="flex justify-between items-center">
                  <span>{customer.name} {customer.lastName}</span>
                  <span className="text-gray-600">{customer.totalSales} orders</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total {currencyFormat(customer.totalAmount)}</span>
                </div>
                <hr className="my-3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
