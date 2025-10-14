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