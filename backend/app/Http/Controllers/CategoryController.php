<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * CLIENT : seulement les catégories actives
     */
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->get();

        return response()->json([
            'data'    => $categories,
            'message' => 'Categories retrieved successfully',
            'count'   => $categories->count(),
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'data'    => $category,
            'message' => 'Category created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        // Charge aussi les produits actifs de cette catégorie
        $category->load(['products' => function ($query) {
            $query->where('is_active', true);
        }]);

        return response()->json([
            'data'    => $category,
            'message' => 'Category retrieved successfully',
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'slug'        => 'sometimes|string|max:255|unique:categories,slug,' . $category->id,
            'description' => 'sometimes|nullable|string',
            'is_active'   => 'sometimes|boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'data'    => $category->fresh(),
            'message' => 'Category updated successfully',
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Vérifie si la catégorie a des produits avant de supprimer
        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with existing products',
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ], 200);
    }
}