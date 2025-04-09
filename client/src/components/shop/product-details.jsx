// Add this at the beginning of your ProductDetailsDialog component
function ProductDetailsDialog({ open, setOpen, productDetails }) {
  // Handle case where productDetails is null or missing place_id
  useEffect(() => {
    if (productDetails && !productDetails.place_id && productDetails._id) {
      // If place_id is missing but _id exists, create a place_id
      productDetails.place_id = `product_${productDetails._id}`;
    }
  }, [productDetails]);

  // If productDetails is null, show a loading state
  if (!productDetails) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Rest of your component...
}