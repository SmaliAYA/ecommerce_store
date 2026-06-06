<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    /**
     * Liste toutes les adresses de l'utilisateur connecté
     */
    public function index()
    {
        $addresses = Address::where('user_id', Auth::id())->get();

        return response()->json([
            'data'    => $addresses,
            'message' => 'Addresses retrieved successfully',
            'count'   => $addresses->count(),
        ], 200);
    }

    /**
     * Créer une nouvelle adresse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name'    => 'required|string|max:255',
            'phone'        => 'required|string|max:20',
            'address_line1'=> 'required|string|max:255',
            'address_line2'=> 'nullable|string|max:255',
            'city'         => 'required|string|max:255',
            'state'        => 'nullable|string|max:255',
            'postal_code'  => 'required|string|max:20',
            'country'      => 'sometimes|string|max:2',
            'is_default'   => 'boolean',
        ]);

        $validated['user_id'] = Auth::id();

        // Si cette adresse est définie par défaut,
        // retire le défaut des autres adresses
        if (!empty($validated['is_default']) && $validated['is_default']) {
            Address::where('user_id', Auth::id())
                ->update(['is_default' => false]);
        }

        $address = Address::create($validated);

        return response()->json([
            'data'    => $address,
            'message' => 'Address created successfully',
        ], 201);
    }

    /**
     * Afficher une adresse spécifique
     */
    public function show(Address $address)
    {
        // Vérifie que l'adresse appartient à l'utilisateur connecté
        if ($address->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'data'    => $address,
            'message' => 'Address retrieved successfully',
        ], 200);
    }

    /**
     * Mettre à jour une adresse
     */
    public function update(Request $request, Address $address)
    {
        if ($address->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'full_name'    => 'sometimes|string|max:255',
            'phone'        => 'sometimes|string|max:20',
            'address_line1'=> 'sometimes|string|max:255',
            'address_line2'=> 'sometimes|nullable|string|max:255',
            'city'         => 'sometimes|string|max:255',
            'state'        => 'sometimes|nullable|string|max:255',
            'postal_code'  => 'sometimes|string|max:20',
            'country'      => 'sometimes|string|max:2',
            'is_default'   => 'sometimes|boolean',
        ]);

        // Si on met cette adresse par défaut,
        // retire le défaut des autres
        if (!empty($validated['is_default']) && $validated['is_default']) {
            Address::where('user_id', Auth::id())
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json([
            'data'    => $address->fresh(),
            'message' => 'Address updated successfully',
        ], 200);
    }

    /**
     * Supprimer une adresse
     */
    public function destroy(Address $address)
    {
        if ($address->user_id !== Auth::id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $address->delete();

        return response()->json([
            'message' => 'Address deleted successfully',
        ], 200);
    }
}