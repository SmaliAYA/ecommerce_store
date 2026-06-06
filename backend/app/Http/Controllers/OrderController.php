<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Liste toutes les commandes de l'utilisateur connecté
     */
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['items.product', 'address', 'payment'])
            ->latest()
            ->get();

        return response()->json([
            'data'    => $orders,
            'message' => 'Orders retrieved successfully',
            'count'   => $orders->count(),
        ], 200);
    }

    /**
     * Créer une nouvelle commande depuis le panier
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'notes'      => 'nullable|string|max:500',
        ]);

        // Vérifie que l'adresse appartient à l'utilisateur connecté
        $address = Auth::user()->addresses()->find($validated['address_id']);
        if (!$address) {
            return response()->json([
                'message' => 'Address not found or unauthorized',
            ], 404);
        }

        // Récupère le panier de l'utilisateur avec ses items
        $cart = Cart::where('user_id', Auth::id())
            ->with('items.product')
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty',
            ], 422);
        }

        // Vérifie le stock de chaque produit
        foreach ($cart->items as $item) {
            if ($item->product->stock < $item->quantity) {
                return response()->json([
                    'message' => "Insufficient stock for product: {$item->product->name}",
                ], 422);
            }
        }

        // Transaction pour éviter les erreurs partielles
        $order = DB::transaction(function () use ($cart, $validated) {
            // Calcule le total
            $totalAmount = $cart->items->sum(function ($item) {
                return $item->quantity * $item->product->price;
            });

            // Crée la commande
            $order = Order::create([
                'user_id'      => Auth::id(),
                'address_id'   => $validated['address_id'],
                'status'       => 'pending',
                'total_amount' => $totalAmount,
                'notes'        => $validated['notes'] ?? null,
            ]);

            // Crée les order items et décrémente le stock
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'unit_price' => $item->product->price,
                    'subtotal'   => $item->quantity * $item->product->price,
                ]);

                // Décrémente le stock du produit
                $item->product->decrement('stock', $item->quantity);
            }

            // Vide le panier après la commande
            $cart->items()->delete();

            return $order;
        });

        return response()->json([
            'data'    => $order->load(['items.product', 'address']),
            'message' => 'Order created successfully',
        ], 201);
    }

    /**
     * Afficher une commande spécifique
     */
    public function show(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $order->load(['items.product', 'address', 'payment']);

        return response()->json([
            'data'    => $order,
            'message' => 'Order retrieved successfully',
        ], 200);
    }

    /**
     * Mettre à jour le statut d'une commande (admin seulement)
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'notes'  => 'sometimes|nullable|string|max:500',
        ]);

        // Si annulation, remet le stock des produits
        if ($validated['status'] === 'cancelled' && $order->status !== 'cancelled') {
            DB::transaction(function () use ($order, $validated) {
                foreach ($order->items as $item) {
                    $item->product->increment('stock', $item->quantity);
                }
                $order->update($validated);
            });
        } else {
            $order->update($validated);
        }

        return response()->json([
            'data'    => $order->fresh()->load(['items.product', 'address', 'payment']),
            'message' => 'Order updated successfully',
        ], 200);
    }

    /**
     * Annuler une commande (par le client)
     */
    public function cancel(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Ne peut annuler que si pending ou confirmed
        if (!in_array($order->status, ['pending', 'confirmed'])) {
            return response()->json([
                'message' => 'Order cannot be cancelled at this stage',
            ], 422);
        }

        DB::transaction(function () use ($order) {
            // Remet le stock
            foreach ($order->items as $item) {
                $item->product->increment('stock', $item->quantity);
            }
            $order->update(['status' => 'cancelled']);
        });

        return response()->json([
            'data'    => $order->fresh(),
            'message' => 'Order cancelled successfully',
        ], 200);
    }

    /**
     * Supprimer une commande (admin seulement)
     */
    public function destroy(Order $order)
    {
        if (!in_array($order->status, ['cancelled', 'delivered'])) {
            return response()->json([
                'message' => 'Cannot delete an active order',
            ], 422);
        }

        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully',
        ], 200);
    }
}