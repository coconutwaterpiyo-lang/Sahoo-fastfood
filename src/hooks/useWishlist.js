import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { addToWishlist, removeFromWishlist } from "../services/wishlistService";

export function useWishlist() {
  const { userData, refreshUserData } = useAuth();
  const { showToast } = useToast();

  const wishlist = userData?.wishlist || [];

  const isInWishlist = (productId) => wishlist.includes(productId);

  const toggleWishlist = async (product) => {
    if (!userData) { showToast("Please login to use wishlist", "info"); return; }

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(userData.uid, product.id);
        showToast("Removed from wishlist", "info");
      } else {
        await addToWishlist(userData.uid, product.id);
        showToast("Added to wishlist ❤️");
      }
      await refreshUserData();
    } catch (err) {
      showToast("Wishlist update failed", "error");
    }
  };

  return { wishlist, isInWishlist, toggleWishlist };
}
