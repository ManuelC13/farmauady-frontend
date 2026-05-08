import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import NewSaleProductsPanel from "../../components/vendedor/NewSaleProductsPanel";
import NewSaleCartPanel from "../../components/vendedor/NewSaleCartPanel";
import { useNewSale } from "../../hooks/vendedor/useNewSale";

function NewSale() {
  const {
    products,
    cart,
    search,
    loading,
    confirming,
    lastSale,
    paymentMethod,
    setPaymentMethod,
    countdown,
    reserving,
    cartQty,
    addToCart,
    increaseQty,
    decreaseQty,
    updateQty,
    removeFromCart,
    handleSearchChange,
    handleConfirmSale,
    handlePrintTicket,
    total,
    totalItems,
  } = useNewSale();

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8FAFC]">
      <div className="flex-none">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 flex flex-col p-8 min-h-0 overflow-hidden">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            <NewSaleProductsPanel
              products={products}
              loading={loading}
              search={search}
              onSearchChange={handleSearchChange}
              onAddToCart={addToCart}
              cartQty={cartQty}
            />

            <NewSaleCartPanel
              cart={cart}
              total={total}
              totalItems={totalItems}
              countdown={countdown}
              reserving={reserving}
              confirming={confirming}
              lastSale={lastSale}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onIncreaseQty={increaseQty}
              onDecreaseQty={decreaseQty}
              onUpdateQty={updateQty}
              onRemoveFromCart={removeFromCart}
              onConfirmSale={handleConfirmSale}
              onPrintTicket={handlePrintTicket}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default NewSale;