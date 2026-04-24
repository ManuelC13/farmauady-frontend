import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import InventoryReportTable from "../../components/inventory/InventoryReportTable";
import SalesReportTable from "../../components/sales/SalesReportTable";

function Reports() {
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate]     = useState(today);
  const [sellerId, setSellerId]   = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    start_date:  today,
    end_date:    today,
    seller_id:   null,
    category_id: null,
  });

  const handleFilter = () => {
    setAppliedFilters({
      start_date:  startDate,
      end_date:    endDate,
      seller_id:   sellerId   || null,
      category_id: categoryId || null,
    });
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-background min-h-screen">
        <Navbar />

        <div className="p-6 px-15 pt-10 flex flex-col gap-8">
          <div>
            <h1 className="text-2xl font-bold mt-2 mb-3">Reportes</h1>
            <p className="text-sm text-gray-400">
              Consulta el estado del inventario y el historial de ventas por período.
            </p>
          </div>

          {/* Reporte de inventario */}
          <InventoryReportTable />

          {/* Reporte de ventas */}
          <SalesReportTable
            startDate={startDate}
            endDate={endDate}
            sellerId={sellerId}
            categoryId={categoryId}
            appliedFilters={appliedFilters}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onSellerChange={setSellerId}
            onCategoryChange={setCategoryId}
            onFilter={handleFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default Reports;