<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    /**
     * Liste tous les paiements de l'utilisateur connecté
     */
    public function index()
    {
        $payments = Payment::where('user_id', Auth::id())
            ->with('order')
            ->latest()
            ->get();

        return response()->json([
            'data'    => $payments,
            'message' => 'Payments retrieved successfully',
            'count'   => $payments->count(),
        ], 200);
    }

    /**
     * Créer un paiement pour une commande
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id'       => 'required|exists:orders,id',
            'method'         => 'required|in:cash_on_delivery,credit_card,paypal,bank_transfer',
            'transaction_id' => 'nullable|string|unique:payments,transaction_id',
            'currency'       => 'sometimes|string|max:3',
        ]);

        // Vérifie que la commande appartient à l'utilisateur connecté
        $order = Order::where('id', $validated['order_id'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order not found or unauthorized',
            ], 404);
        }

        // Vérifie qu'un paiement n'existe pas déjà pour cette commande
        if (Payment::where('order_id', $order->id)->exists()) {
            return response()->json([
                'message' => 'Payment already exists for this order',
            ], 422);
        }

        $payment = Payment::create([
            'order_id'       => $order->id,
            'user_id'        => Auth::id(),
            'method'         => $validated['method'],
            'transaction_id' => $validated['transaction_id'] ?? null,
            'currency'       => $validated['currency'] ?? 'MAD',
            'amount'         => $order->total_amount,
            'status'         => 'pending',
        ]);

        return response()->json([
            'data'    => $payment,
            'message' => 'Payment created successfully',
        ], 201);
    }

    /**
     * Afficher un paiement spécifique
     */
    public function show(Payment $payment)
    {
        if ($payment->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $payment->load('order');

        return response()->json([
            'data'    => $payment,
            'message' => 'Payment retrieved successfully',
        ], 200);
    }

    /**
     * Mettre à jour le statut d'un paiement (admin seulement)
     */
    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'status'         => 'required|in:pending,paid,failed,refunded',
            'transaction_id' => 'sometimes|string|unique:payments,transaction_id,' . $payment->id,
        ]);

        // Si le paiement passe à "paid", enregistre la date
        if ($validated['status'] === 'paid') {
            $validated['paid_at'] = now();

            // Met à jour le statut de la commande aussi
            $payment->order->update(['status' => 'confirmed']);
        }

        if ($validated['status'] === 'refunded') {
            $payment->order->update(['status' => 'cancelled']);
        }

        $payment->update($validated);

        return response()->json([
            'data'    => $payment->fresh(),
            'message' => 'Payment updated successfully',
        ], 200);
    }

    /**
     * Supprimer un paiement (admin seulement)
     */
    public function destroy(Payment $payment)
    {
        if ($payment->status === 'paid') {
            return response()->json([
                'message' => 'Cannot delete a completed payment',
            ], 422);
        }

        $payment->delete();

        return response()->json([
            'message' => 'Payment deleted successfully',
        ], 200);
    }
}