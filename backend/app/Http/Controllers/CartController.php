<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Afficher le panier de l'utilisateur connecté
     */
    public function index()
    {
        $cart = Cart::where('user_id', Auth::id())
            ->with('items.product')
            ->first();

        if (!$cart) {
            return response()->json([
                'data'    => null,
                'message' => 'Cart is empty',
            ], 200);
        }

        return response()->json([
            'data'    => $cart,
            'total'   => $cart->total,
            'message' => 'Cart retrieved successfully',
        ], 200);
    }

    /**
     * Ajouter un produit au panier
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        // Vérifie que le produit est actif
        $product = Product::where('id', $validated['product_id'])
            ->where('is_active', true)
            ->first();

        if (!$product) {
            return response()->json([
                'message' => 'Product not found or unavailable',
            ], 404);
        }

        // Vérifie le stock
        if ($product->stock < $validated['quantity']) {
            return response()->json([
                'message' => 'Insufficient stock',
            ], 422);
        }

        // Crée le panier si il n'existe pas encore
        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);

        // Si le produit existe déjà dans le panier, met à jour la quantité
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $validated['quantity'];

            // Vérifie le stock avec la nouvelle quantité
            if ($product->stock < $newQuantity) {
                return response()->json([
                    'message' => 'Insufficient stock',
                ], 422);
            }

            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            CartItem::create([
                'cart_id'    => $cart->id,
                'product_id' => $validated['product_id'],
                'quantity'   => $validated['quantity'],
            ]);
        }

        return response()->json([
            'data'    => $cart->fresh()->load('items.product'),
            'total'   => $cart->total,
            'message' => 'Product added to cart successfully',
        ], 201);
    }

    /**
     * Mettre à jour la quantité d'un item du panier
     */
    public function update(Request $request, CartItem $cartItem)
    {
        // Vérifie que l'item appartient au panier de l'utilisateur connecté
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Vérifie le stock
        if ($cartItem->product->stock < $validated['quantity']) {
            return response()->json([
                'message' => 'Insufficient stock',
            ], 422);
        }

        $cartItem->update($validated);

        $cart = $cartItem->cart->load('items.product');

        return response()->json([
            'data'    => $cart,
            'total'   => $cart->total,
            'message' => 'Cart item updated successfully',
        ], 200);
    }

    /**
     * Supprimer un item du panier
     */
    public function destroy(CartItem $cartItem)
    {
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $cart = $cartItem->cart;
        $cartItem->delete();

        return response()->json([
            'data'    => $cart->fresh()->load('items.product'),
            'total'   => $cart->fresh()->total,
            'message' => 'Item removed from cart successfully',
        ], 200);
    }

    /**
     * Vider tout le panier
     */
    public function clear()
    {
        $cart = Cart::where('user_id', Auth::id())->first();

        if (!$cart) {
            return response()->json([
                'message' => 'Cart not found',
            ], 404);
        }

        $cart->items()->delete();

        return response()->json([
            'message' => 'Cart cleared successfully',
        ], 200);
    }
}