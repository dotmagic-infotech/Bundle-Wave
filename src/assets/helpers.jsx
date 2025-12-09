export const getTotalPrice = (list = []) => {
    try {
        return list.reduce((sum, item) => {
            const variantPrice = parseFloat(item.variants?.[0]?.price || 0);
            const count = item.product_count || 1;
            return sum + variantPrice * count;
        }, 0);
    } catch (err) {
        console.error("Error calculating total price:", err);
        return 0;
    }
};

export const getDiscountAndFinal = (doid, total = 0, discountValue = 0) => {
    const d = Number(doid);
    const original = Number(total) || 0;
    const dv = Number(discountValue) || 0;

    let discountPrice = 0;

    if (d === 1) {
        // percentage discount
        const pct = Math.max(0, Math.min(dv, 100));
        discountPrice = (original * pct) / 100;
    } else if (d === 2) {
        // fixed amount discount
        discountPrice = Math.max(0, dv);
    }

    // discount cannot exceed total
    if (discountPrice > original) discountPrice = original;

    const finalPrice = original - discountPrice;

    return {
        discountPrice: discountPrice.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
    };
};

export const normalizeProduct = (p) => ({
  id: p.id || null,
  title: p.title || "",
  image: p.image || "",
  variants: p.variants || [],
});
