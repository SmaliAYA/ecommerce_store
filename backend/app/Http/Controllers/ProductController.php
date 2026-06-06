<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all();
return response()->json([
'data' => $products,
'message' => 'Products retrieved successfully',
'count' => $products->count(),
], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
   
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([

        'name'=>'required|string|max:255',
        'slug'=>'required|string|max:255|unique:products,slug',
        'description'=>'nullable|string',
        'price'=>'required|numeric',
        'stock'=>'required|integer',
        'image'=>'nullable|string|max:255',
        'category_id'=>'required|exists:categories,id',
        'is_active'=>'boolean'
]);
$product = Product::create($validated);
return response()->json([
'data' => $product,
'message' => 'Product created successfully',
], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json([
            'data' => $product,
            'message' => 'Product retrieved successfully',
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    
    {
$validated = $request->validate([
        'name'=>'sometimes|string|max:255',
        'slug' => 'sometimes|string|max:255|unique:products,slug,' . $product->id,
        'description'=>'sometimes|string',
        'price'=>'sometimes|numeric',
        'stock'=>'sometimes|integer',
        'image'=>'sometimes|string|max:255',
        'category_id'=>'sometimes|exists:categories,id',
        'is_active'=>'sometimes|boolean'
]);

        $product->update($validated);

        return response()->json([
            'data'    => $product->fresh(),
            'message' => 'Product updated successfully',
        ], 200);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {

$product->delete();
return response()->json([
'message' => 'Product deleted successfully',
], 200);
    }
}
